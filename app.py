from flask import Flask, render_template, request, send_file, jsonify
from rembg import remove
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)

# Maximum file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET", "POST"])
def root():
    if request.method == "POST":
        # Check if file exists in request
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # Check if file was selected
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Check file type
        if not allowed_file(file.filename):
            return (
                jsonify(
                    {"error": "Invalid file type. Allowed types: PNG, JPG, JPEG, WEBP"}
                ),
                400,
            )

        # Check file size
        file_content = file.read()
        if len(file_content) > MAX_FILE_SIZE:
            return jsonify({"error": "File size too large. Maximum size is 10MB"}), 400

        try:
            # Reset file pointer after reading content
            file.seek(0)
            input_image = Image.open(BytesIO(file_content))
            output_image = remove(input_image, post_process_mask=True)

            # Save to BytesIO
            img_io = BytesIO()
            output_image.save(img_io, "PNG")
            img_io.seek(0)

            return send_file(img_io, mimetype="image/png")

        except Exception as e:
            app.logger.error(f"Error processing image: {str(e)}")
            return jsonify({"error": "Failed to process image"}), 500

    return render_template("index.html")


if __name__ == "__main__":
    app.run()
