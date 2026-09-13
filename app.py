# -*- coding: utf-8 -*-
import os
import sys
import json
import hashlib
import secrets
import time
from datetime import datetime, timezone
from functools import wraps
from flask import Flask, request, session, render_template, jsonify, send_from_directory, abort, redirect, url_for
from flask_cors import CORS
import logging

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'chirag-portfolio-secret-key-change-in-production')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)
logger = logging.getLogger("chirag-portfolio")

app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE", "false").lower() == "true"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "").strip()
if ALLOWED_ORIGINS:
    origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]
else:
    origins = ["*"]
CORS(app, resources={r"/api/*": {"origins": origins}})

@app.after_request
def _security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if request.is_secure:
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    return response

@app.after_request
def _cache_static(response):
    if request.path.startswith(("/static/", "/uploads/", "/public/", "/assets/")):
        response.cache_control.max_age = 86400
        response.cache_control.public = True
    return response

@app.after_request
def _admin_session_clear(response):
    try:
        is_admin_page = request.path.startswith("/admin") and request.endpoint != "admin_login"
        is_success = response.status_code < 400
        if is_admin_page and is_success:
            session.pop("logged_in", None)
    except Exception:
        pass
    return response

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
UPLOADS_DIR = os.path.join(ROOT_DIR, "uploads")
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'chiragm7622')

_login_attempts = {}

def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def escapeHtml(text):
    if text is None:
        return ""
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

def formatSize(size):
    if size is None:
        return "0 B"
    size = int(size)
    for unit in ["B", "KB", "MB", "GB"]:
        if abs(size) < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"

def load_json(filename, default=None):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        if default is not None:
            with open(path, "w", encoding="utf-8-sig") as f:
                json.dump(default, f, indent=2, ensure_ascii=False)
            return default
        return None
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8-sig") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, path)

def generate_csrf_token():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(16)
    return session["csrf_token"]

app.jinja_env.globals['csrf_token'] = generate_csrf_token

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("logged_in"):
            return redirect(url_for("admin_login"))
        return f(*args, **kwargs)
    return decorated


def csrf_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return f(*args, **kwargs)
        token = request.headers.get('X-CSRFToken')
        if not token:
            data = request.get_json(silent=True) or {}
            token = data.get('csrf_token')
        if not token:
            token = request.form.get('csrf_token')
        if not token or token != session.get('csrf_token'):
            return jsonify({'error': 'Invalid CSRF token'}), 403
        return f(*args, **kwargs)
    return decorated

def _check_rate_limit(ip):
    now = time.time()
    if ip not in _login_attempts:
        _login_attempts[ip] = []
    _login_attempts[ip] = [t for t in _login_attempts[ip] if now - t < 60]
    if len(_login_attempts[ip]) >= 5:
        return False
    _login_attempts[ip].append(now)
    return True

def _get_settings():
    return load_json("settings.json", {})

def _get_projects():
    return load_json("projects.json", [])

def _get_categories():
    return load_json("categories.json", [])

def _get_media():
    return load_json("media.json", [])

def _save_settings(data):
    save_json("settings.json", data)

def _save_projects(data):
    save_json("projects.json", data)

def _save_categories(data):
    save_json("categories.json", data)

def _save_media(data):
    save_json("media.json", data)

def _get_sorted_projects():
    projects = _get_projects()
    published = [p for p in projects if p.get("published", False)]
    published.sort(key=lambda p: (not p.get("featured", False), p.get("sortOrder", 0), p.get("updatedAt", "")))
    return published

def _get_software():
    return load_json("software.json", [])

def _save_software(data):
    save_json("software.json", data)

def _slugify(text):
    import re
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")

def _ensure_dirs():
    for d in [DATA_DIR, PUBLIC_DIR, UPLOADS_DIR, os.path.join(UPLOADS_DIR, "projects"), os.path.join(UPLOADS_DIR, "hero")]:
        os.makedirs(d, exist_ok=True)

_ensure_dirs()
_software_init_path = os.path.join(DATA_DIR, "software.json")
if not os.path.exists(_software_init_path):
    with open(_software_init_path, "w", encoding="utf-8-sig") as f:
        json.dump([], f, indent=2, ensure_ascii=False)


@app.route("/")
def index():
    return send_from_directory(ROOT_DIR, "index.html")

@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(UPLOADS_DIR, filename)

@app.route("/<path:filename>")
def static_files(filename):
    root_path = os.path.join(ROOT_DIR, filename)
    if os.path.isfile(root_path):
        return send_from_directory(ROOT_DIR, filename)
    # Handle paths starting with public/ by serving from PUBLIC_DIR
    if filename.startswith("public/"):
        public_filename = filename[len("public/"):]
        public_path = os.path.join(PUBLIC_DIR, public_filename)
        if os.path.isfile(public_path):
            return send_from_directory(PUBLIC_DIR, public_filename)
    abort(404)

@app.route("/admin/static/<path:filename>")
def admin_static(filename):
    return send_from_directory(ROOT_DIR, filename)

@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/api/settings", methods=["GET"])
def api_get_settings():
    return jsonify(_get_settings())

@app.route("/api/projects", methods=["GET"])
def api_get_projects():
    return jsonify(_get_sorted_projects())

@app.route("/api/projects/<slug>", methods=["GET"])
def api_get_project(slug):
    projects = _get_projects()
    for p in projects:
        if p.get("slug") == slug and p.get("published", False):
            return jsonify(p)
    abort(404)

@app.route("/api/categories", methods=["GET"])
def api_get_categories():
    return jsonify(_get_categories())

@app.route("/api/software", methods=["GET"])
def api_get_software():
    software = _get_software()
    active = [s for s in software if s.get("isActive", True)]
    active.sort(key=lambda s: s.get("sortOrder", 0))
    return jsonify(active)

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "GET":
        return render_template("admin/login.html")
    ip = request.remote_addr
    if not _check_rate_limit(ip):
        return render_template("admin/login.html", error="Too many attempts. Try again later."), 429
    password = request.form.get("password", "")
    csrf = request.form.get("csrf_token", "")
    if csrf != session.get("csrf_token"):
        return render_template("admin/login.html", error="Invalid CSRF token."), 400
    if secrets.compare_digest(hashlib.sha256(password.encode()).hexdigest(), hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()):
        session["logged_in"] = True
        session.permanent = False
        return redirect(url_for("admin_dashboard"))
    return render_template("admin/login.html", error="Invalid password."), 401

@app.route("/admin/logout", methods=["GET"])
@login_required
def admin_logout():
    session.pop("logged_in", None)
    return redirect(url_for("admin_login"))

@app.route("/admin")
@login_required
def admin_dashboard():
    settings = _get_settings()
    projects = _get_projects()
    categories = _get_categories()
    media = _get_media()
    content = f"""
        <div class="page-header">
            <h1 class="page-title">Dashboard</h1>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{len(projects)}</div>
                <div class="stat-label">Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{len(categories)}</div>
                <div class="stat-label">Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{len(media)}</div>
                <div class="stat-label">Media Files</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{"Yes" if settings.get("heroImage") else "No"}</div>
                <div class="stat-label">Hero Image</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{len(settings.get('skills', []))}</div>
                <div class="stat-label">Skills</div>
            </div>
        </div>
        <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="/admin/projects" class="btn btn-primary">Add Project</a>
                <a href="/admin/media" class="btn btn-secondary">Upload Media</a>
                <a href="/admin/settings" class="btn btn-secondary">Edit Settings</a>
            </div>
        </div>
    """
    return render_template("admin/dashboard.html", active_page="dashboard", content=content)

@app.route("/admin/projects", methods=["GET"])
@login_required
def admin_projects_page():
    projects = _get_projects()
    categories = _get_categories()
    cat_options = "".join(f'<option value="{c["id"]}">{c["name"]}</option>' for c in categories)
    return render_template("admin/projects.html", active_page="projects", projects=projects, categories=cat_options)

@app.route("/admin/categories", methods=["GET"])
@login_required
def admin_categories_page():
    categories = _get_categories()
    return render_template("admin/categories.html", active_page="categories", categories=categories)

@app.route("/admin/settings", methods=["GET"])
@login_required
def admin_settings_page():
    settings = _get_settings()
    raw_skills = settings.get("skills", [])
    skills_list = []
    for s in raw_skills:
        if isinstance(s, dict):
            skills_list.append(s.get("name", str(s)))
        else:
            skills_list.append(str(s))
    exp_list = settings.get("resume", {}).get("experience", [])
    return render_template("admin/settings.html", active_page="settings", settings=settings, skills_list=skills_list, experience_list=exp_list)

@app.route("/admin/media", methods=["GET"])
@login_required
def admin_media_page():
    media = _get_media()
    return render_template("admin/media.html", active_page="media", media=media, formatSize=formatSize)

@app.route("/admin/seo", methods=["GET"])
@login_required
def admin_seo_page():
    settings = _get_settings()
    return render_template("admin/seo.html", active_page="seo", settings=settings)

@app.route("/admin/skills", methods=["GET"])
@login_required
def admin_skills_page():
    settings = _get_settings()
    raw_skills = settings.get("skills", [])
    skills = []
    for s in raw_skills:
        if isinstance(s, dict):
            skills.append(s.get("name", str(s)))
        else:
            skills.append(str(s))
    return render_template("admin/skills.html", active_page="skills", skills=skills)

@app.route("/admin/experience", methods=["GET"])
@login_required
def admin_experience_page():
    settings = _get_settings()
    exp_list = settings.get("resume", {}).get("experience", [])
    return render_template("admin/experience.html", active_page="experience", experience_list=exp_list, enumerate=enumerate)

@app.route("/admin/software", methods=["GET"])
@login_required
def admin_software_page():
    software = _get_software()
    return render_template("admin/software.html", active_page="software", software=software)

@app.route("/api/admin/projects", methods=["GET"])
@login_required
def api_admin_get_projects():
    return jsonify(_get_projects())

@app.route("/api/admin/projects", methods=["POST"])
@login_required
@csrf_required
def api_admin_create_project():
    data = request.get_json(force=True)
    projects = _get_projects()
    slug = data.get("slug") or _slugify(data.get("title", ""))
    if not slug:
        return jsonify({"error": "Slug required"}), 400
    for p in projects:
        if p.get("slug") == slug:
            return jsonify({"error": "Slug already exists"}), 400
    now = now_iso()
    project = {
        "id": data.get("id") or slug,
        "title": data.get("title", ""),
        "slug": slug,
        "categoryId": data.get("categoryId", ""),
        "year": data.get("year", ""),
        "role": data.get("role", ""),
        "description": data.get("description", ""),
        "featured": data.get("featured", False),
        "published": data.get("published", False),
        "sortOrder": data.get("sortOrder", 0),
        "software": data.get("software", []),
        "coverImage": data.get("coverImage") or data.get("image", ""),
        "heroImage": data.get("heroImage", ""),
        "gallery": data.get("gallery", []),
        "video": data.get("video", ""),
        "optimization": data.get("optimization", ""),
        "credits": data.get("credits", []),
        "createdAt": now,
        "updatedAt": now
    }
    projects.append(project)
    _save_projects(projects)
    return jsonify(project)

@app.route("/api/admin/projects/<slug>", methods=["PUT"])
@login_required
@csrf_required
def api_admin_update_project(slug):
    data = request.get_json(force=True)
    projects = _get_projects()
    for i, p in enumerate(projects):
        if p.get("slug") == slug:
            p.update(data)
            if "image" in data and "coverImage" not in data:
                p["coverImage"] = data.get("image", "")
            if "tags" in data and "software" not in data:
                p["software"] = data.get("tags", [])
            p["updatedAt"] = now_iso()
            _save_projects(projects)
            return jsonify(p)
    return jsonify({"error": "Project not found"}), 404

@app.route("/api/admin/projects/<slug>", methods=["DELETE"])
@login_required
@csrf_required
def api_admin_delete_project(slug):
    projects = _get_projects()
    for i, p in enumerate(projects):
        if p.get("slug") == slug:
            projects.pop(i)
            _save_projects(projects)
            return jsonify({"success": True})
    return jsonify({"error": "Project not found"}), 404

@app.route("/api/admin/settings/skills", methods=["GET"])
@login_required
def api_admin_get_skills():
    settings = _get_settings()
    raw = settings.get("skills", [])
    normalized = []
    for s in raw:
        if isinstance(s, dict):
            normalized.append(s.get("name", str(s)))
        else:
            normalized.append(str(s))
    return jsonify(normalized)

@app.route("/api/admin/settings/skills", methods=["PUT"])
@login_required
@csrf_required
def api_admin_put_skills():
    data = request.get_json(force=True)
    if not isinstance(data, list):
        return jsonify({"error": "Skills must be an array"}), 400
    settings = _get_settings()
    settings["skills"] = data
    settings["updatedAt"] = now_iso()
    _save_settings(settings)
    return jsonify(settings["skills"])

@app.route("/api/admin/settings/experience", methods=["GET"])
@login_required
def api_admin_get_experience():
    settings = _get_settings()
    return jsonify(settings.get("resume", {}).get("experience", []))

@app.route("/api/admin/settings/experience", methods=["POST"])
@login_required
@csrf_required
def api_admin_post_experience():
    data = request.get_json(force=True)
    settings = _get_settings()
    if "resume" not in settings:
        settings["resume"] = {}
    if "experience" not in settings["resume"]:
        settings["resume"]["experience"] = []
    settings["resume"]["experience"].append(data)
    settings["updatedAt"] = now_iso()
    _save_settings(settings)
    return jsonify(data)

@app.route("/api/admin/settings/experience/<int:index>", methods=["PUT"])
@login_required
@csrf_required
def api_admin_put_experience(index):
    data = request.get_json(force=True)
    settings = _get_settings()
    exp = settings.get("resume", {}).get("experience", [])
    if 0 <= index < len(exp):
        exp[index] = data
        settings["updatedAt"] = now_iso()
        _save_settings(settings)
        return jsonify(data)
    return jsonify({"error": "Experience not found"}), 404

@app.route("/api/admin/settings/experience/<int:index>", methods=["DELETE"])
@login_required
@csrf_required
def api_admin_delete_experience(index):
    settings = _get_settings()
    exp = settings.get("resume", {}).get("experience", [])
    if 0 <= index < len(exp):
        exp.pop(index)
        settings["updatedAt"] = now_iso()
        _save_settings(settings)
        return jsonify({"success": True})
    return jsonify({"error": "Experience not found"}), 404

@app.route("/api/admin/software", methods=["GET"])
@login_required
def api_admin_get_software():
    return jsonify(_get_software())

@app.route("/api/admin/software", methods=["POST"])
@login_required
@csrf_required
def api_admin_create_software():
    data = request.get_json(force=True)
    software = _get_software()
    now = now_iso()
    new_item = {
        "id": data.get("id") or secrets.token_hex(8),
        "name": data.get("name", ""),
        "icon": data.get("icon", ""),
        "category": data.get("category", "3D Skills"),
        "description": data.get("description", ""),
        "isActive": data.get("isActive", True),
        "sortOrder": data.get("sortOrder", 0),
        "createdAt": now,
        "updatedAt": now
    }
    if not new_item["id"] or not new_item["name"]:
        return jsonify({"error": "ID and name required"}), 400
    for s in software:
        if s.get("id") == new_item["id"]:
            return jsonify({"error": "ID already exists"}), 400
    software.append(new_item)
    _save_software(software)
    return jsonify(new_item)

@app.route("/api/admin/software/<id>", methods=["PUT"])
@login_required
@csrf_required
def api_admin_update_software(id):
    data = request.get_json(force=True)
    software = _get_software()
    for i, s in enumerate(software):
        if s.get("id") == id:
            software[i].update(data)
            software[i]["updatedAt"] = now_iso()
            _save_software(software)
            return jsonify(software[i])
    return jsonify({"error": "Software not found"}), 404

@app.route("/api/admin/software/<id>", methods=["DELETE"])
@login_required
@csrf_required
def api_admin_delete_software(id):
    software = _get_software()
    for i, s in enumerate(software):
        if s.get("id") == id:
            software.pop(i)
            _save_software(software)
            return jsonify({"success": True})
    return jsonify({"error": "Software not found"}), 404

@app.route("/api/admin/software/<id>/status", methods=["PATCH"])
@login_required
@csrf_required
def api_admin_toggle_software_status(id):
    data = request.get_json(silent=True) or {}
    software = _get_software()
    for i, s in enumerate(software):
        if s.get("id") == id:
            software[i]["isActive"] = data.get("isActive", not s.get("isActive", True))
            software[i]["updatedAt"] = now_iso()
            _save_software(software)
            return jsonify(software[i])
    return jsonify({"error": "Software not found"}), 404

@app.route("/api/admin/settings/editable", methods=["GET"])
@login_required
def api_admin_get_editable():
    return jsonify(_get_settings())

@app.route("/api/admin/settings", methods=["PUT"])
@login_required
@csrf_required
def api_admin_put_settings():
    data = request.get_json(force=True)
    settings = _get_settings()
    settings.update(data)
    if "experience" in data:
        if "resume" not in settings:
            settings["resume"] = {}
        settings["resume"]["experience"] = data["experience"]
        if "experience" in settings:
            del settings["experience"]
    settings["updatedAt"] = now_iso()
    _save_settings(settings)
    return jsonify(settings)

@app.route("/api/admin/categories", methods=["GET"])
@login_required
def api_admin_get_categories():
    return jsonify(_get_categories())

@app.route("/api/admin/categories", methods=["POST"])
@login_required
@csrf_required
def api_admin_create_category():
    data = request.get_json(force=True)
    categories = _get_categories()
    new_cat = {
        "id": data.get("id") or _slugify(data.get("name", "")),
        "name": data.get("name", ""),
        "slug": data.get("slug") or _slugify(data.get("name", ""))
    }
    if not new_cat["id"] or not new_cat["name"]:
        return jsonify({"error": "Name and ID required"}), 400
    categories.append(new_cat)
    _save_categories(categories)
    return jsonify(new_cat)

@app.route("/api/admin/categories/<id>", methods=["PUT"])
@login_required
@csrf_required
def api_admin_update_category(id):
    data = request.get_json(force=True)
    categories = _get_categories()
    for c in categories:
        if c["id"] == id:
            c.update(data)
            if "slug" not in data:
                c["slug"] = _slugify(c["name"])
            _save_categories(categories)
            return jsonify(c)
    return jsonify({"error": "Category not found"}), 404

@app.route("/api/admin/categories/<id>", methods=["DELETE"])
@login_required
@csrf_required
def api_admin_delete_category(id):
    categories = _get_categories()
    for i, c in enumerate(categories):
        if c["id"] == id:
            categories.pop(i)
            _save_categories(categories)
            return jsonify({"success": True})
    return jsonify({"error": "Category not found"}), 404

@app.route("/api/admin/media", methods=["GET"])
@login_required
def api_admin_get_media():
    return jsonify(_get_media())

@app.route("/api/admin/media/<id>", methods=["DELETE"])
@login_required
@csrf_required
def api_admin_delete_media(id):
    media = _get_media()
    for i, m in enumerate(media):
        if m["id"] == id:
            media.pop(i)
            _save_media(media)
            return jsonify({"success": True})
    return jsonify({"error": "Media not found"}), 404

@app.route("/admin/upload", methods=["POST"])
@login_required
@csrf_required
def admin_upload():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    folder = request.form.get("folder", "general")
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    filename = secrets.token_hex(8) + "_" + file.filename
    upload_dir = os.path.join(UPLOADS_DIR, folder)
    os.makedirs(upload_dir, exist_ok=True)
    path = os.path.join(upload_dir, filename)
    file.save(path)
    size = os.path.getsize(path)
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    media_item = {
        "id": filename,
        "filename": file.filename,
        "url": "/uploads/" + folder + "/" + filename,
        "folder": folder,
        "size": size,
        "type": ext,
        "createdAt": now_iso()
    }
    media = _get_media()
    media.append(media_item)
    _save_media(media)
    return jsonify(media_item)

@app.route("/api/admin/hero-image", methods=["POST"])
@login_required
@csrf_required
def api_admin_hero_image():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    filename = secrets.token_hex(8) + "_" + file.filename
    hero_dir = os.path.join(UPLOADS_DIR, "hero")
    os.makedirs(hero_dir, exist_ok=True)
    path = os.path.join(hero_dir, filename)
    file.save(path)
    size = os.path.getsize(path)
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    media_item = {
        "id": filename,
        "filename": file.filename,
        "url": "/uploads/hero/" + filename,
        "folder": "hero",
        "size": size,
        "type": ext,
        "createdAt": now_iso()
    }
    media = _get_media()
    media.append(media_item)
    _save_media(media)
    settings = _get_settings()
    settings["heroImage"] = media_item["url"]
    settings["updatedAt"] = now_iso()
    _save_settings(settings)
    return jsonify({"media": media_item, "settings": settings})

@app.route("/api/admin/hero-image/clear", methods=["POST"])
@login_required
@csrf_required
def api_admin_hero_image_clear():
    settings = _get_settings()
    settings["heroImage"] = ""
    settings["updatedAt"] = now_iso()
    _save_settings(settings)
    return jsonify({"success": True, "settings": settings})

@app.route("/api/admin/software/upload", methods=["POST"])
@login_required
@csrf_required
def api_admin_upload_software_icon():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    allowed = {"png", "jpg", "jpeg", "webp"}
    filename = file.filename
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in allowed:
        return jsonify({"error": "Invalid file type. Allowed: PNG, JPG, WEBP"}), 400

    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > 2 * 1024 * 1024:
        return jsonify({"error": "File too large. Maximum 2MB."}), 400

    safe_name = secrets.token_hex(8) + "." + ext
    upload_dir = os.path.join(UPLOADS_DIR, "software")
    os.makedirs(upload_dir, exist_ok=True)
    path = os.path.join(upload_dir, safe_name)
    file.save(path)

    return jsonify({
        "url": "/uploads/software/" + safe_name,
        "filename": safe_name,
        "size": size,
        "type": ext
    })

@app.route("/admin/seo", methods=["PUT"])
@login_required
@csrf_required
def admin_seo_put():
    data = request.get_json(force=True)
    settings = _get_settings()
    settings.update(data)
    settings["updatedAt"] = now_iso()
    _save_settings(settings)
    return jsonify(settings)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("DEBUG", "1") == "1"
    if not debug:
        required = ["FLASK_SECRET_KEY", "ADMIN_PASSWORD"]
        missing = [v for v in required if not os.environ.get(v)]
        if missing:
            raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")
    app.run(host="0.0.0.0", port=port, debug=debug)


