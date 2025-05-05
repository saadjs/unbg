# unbg

A simple Flask app to remove background from images using [rembg](https://github.com/danielgatis/rembg).

## Development

Clone the repo

```bash
git clone git@github.com:saadjs/unbg.git
cd unbg
```

Create and activate virtual environment

```bash
# Create a new virtual environment
python -m venv venv

source venv/bin/activate
```

Install the required dependencies

```bash
pip install -r requirements.txt
```

To run the dev server

```bash
make dev
```

This will start the Flask dev server with debugging on `http://0.0.0.0:8080`.
