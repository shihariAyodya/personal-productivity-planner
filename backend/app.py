from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///planner.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

CATEGORIES = ["University", "Career", "Shizelle"]


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    subtype = db.Column(db.String(50), default="")
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    done = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "subtype": self.subtype or "",
            "date": self.date,
            "done": self.done,
        }


with app.app_context():
    db.create_all()


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/tasks", methods=["GET"])
def list_tasks():
    tasks = Task.query.order_by(Task.id.desc()).all()
    return jsonify([t.to_dict() for t in tasks])


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400
    if data.get("category") not in CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400
    if not data.get("date"):
        return jsonify({"error": "Date is required"}), 400

    task = Task(
        title=title,
        category=data["category"],
        subtype=data.get("subtype", ""),
        date=data["date"],
        done=bool(data.get("done", False)),
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = db.get_or_404(Task, task_id)
    data = request.get_json(silent=True) or {}

    if "title" in data:
        title = (data["title"] or "").strip()
        if not title:
            return jsonify({"error": "Title cannot be empty"}), 400
        task.title = title
    if "category" in data:
        if data["category"] not in CATEGORIES:
            return jsonify({"error": "Invalid category"}), 400
        task.category = data["category"]
    if "subtype" in data:
        task.subtype = data["subtype"]
    if "date" in data:
        task.date = data["date"]
    if "done" in data:
        task.done = bool(data["done"])

    db.session.commit()
    return jsonify(task.to_dict())


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = db.get_or_404(Task, task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"deleted": task_id})


if __name__ == "__main__":
    app.run(debug=True, port=5000)