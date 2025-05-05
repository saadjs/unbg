const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const uploadBtn = document.getElementById('uploadBtn');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const processBtn = document.getElementById('processBtn');
const loadingContainer = document.getElementById('loadingContainer');
const resultContainer = document.getElementById('resultContainer');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function validateFile(file) {
	if (!file.type.match('image.*')) {
		showError('Please select an image file');
		return false;
	}
	if (file.size > MAX_FILE_SIZE) {
		showError(
			`File size too large. Maximum size is ${formatFileSize(
				MAX_FILE_SIZE
			)}`
		);
		return false;
	}
	return true;
}

function showFilePreview(file) {
	const reader = new FileReader();
	reader.onload = function (e) {
		imagePreview.src = e.target.result;
		previewContainer.style.display = 'flex';
		dropZone.style.display = 'none';

		// Add file info
		const fileInfo = document.createElement('div');
		fileInfo.className = 'file-info';
		fileInfo.innerHTML = `
            <p>File: ${file.name}</p>
            <p>Size: ${formatFileSize(file.size)}</p>
            <p>Type: ${file.type}</p>
        `;
		previewContainer.insertBefore(fileInfo, processBtn);
	};
	reader.readAsDataURL(file);
	uploadBtn.disabled = false;
}

// Event Listeners
dropZone.addEventListener('click', function (e) {
	if (e.target !== uploadBtn) {
		fileInput.click();
	}
});

fileInput.addEventListener('change', function () {
	if (fileInput.files.length > 0) {
		const file = fileInput.files[0];
		if (validateFile(file)) {
			showFilePreview(file);
		}
	}
});

// Drag and drop events
dropZone.addEventListener('dragover', function (e) {
	e.preventDefault();
	e.stopPropagation();
	this.classList.add('dragover');
});

dropZone.addEventListener('dragleave', function (e) {
	e.preventDefault();
	e.stopPropagation();
	this.classList.remove('dragover');
});

dropZone.addEventListener('drop', function (e) {
	e.preventDefault();
	e.stopPropagation();
	this.classList.remove('dragover');

	if (e.dataTransfer.files.length) {
		let file = e.dataTransfer.files[0];
		fileInput.files = e.dataTransfer.files;

		if (validateFile(file)) {
			showFilePreview(file);
		}
	}
});

// Process button
processBtn.addEventListener('click', function () {
	if (fileInput.files.length > 0) {
		loadingContainer.style.display = 'flex';
		previewContainer.style.display = 'none';
		processFile(fileInput.files[0]);
	}
});

// Upload button
uploadBtn.addEventListener('click', function () {
	if (fileInput.files.length > 0) {
		loadingContainer.style.display = 'flex';
		dropZone.style.display = 'none';
		processFile(fileInput.files[0]);
	}
});

// Reset button
resetBtn.addEventListener('click', resetApp);

// Process file function - uses fetch to submit the form
function processFile(file) {
	const formData = new FormData();
	formData.append('file', file);

	fetch('/', {
		method: 'POST',
		body: formData,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.blob();
		})
		.then((blob) => {
			// Create object URL from blob
			const objectUrl = URL.createObjectURL(blob);

			// Display the result image
			resultImage.src = objectUrl;

			// Set download link
			downloadBtn.href = objectUrl;
			downloadBtn.download =
				file.name.replace(/\.[^/.]+$/, '') + '_rmbg.png';

			// Hide loading, show result
			loadingContainer.style.display = 'none';
			resultContainer.style.display = 'flex';
		})
		.catch((error) => {
			console.error('Error:', error);
			showError('Failed to process image. Please try again.');
			loadingContainer.style.display = 'none';
		});
}

function resetApp() {
	// Reset the form
	uploadForm.reset();
	uploadBtn.disabled = true;

	// Hide containers
	previewContainer.style.display = 'none';
	resultContainer.style.display = 'none';
	loadingContainer.style.display = 'none';
	errorMessage.style.display = 'none';

	// Show drop zone
	dropZone.style.display = 'flex';

	// Clear images
	imagePreview.src = '#';
	resultImage.src = '#';

	// Revoke any object URLs to prevent memory leaks
	if (resultImage.src && resultImage.src.startsWith('blob:')) {
		URL.revokeObjectURL(resultImage.src);
	}
}

function showError(message) {
	errorMessage.textContent = message;
	errorMessage.style.display = 'block';
	loadingContainer.style.display = 'none';
}

// Theme toggle functionality
function getPreferredTheme() {
	const storedTheme = localStorage.getItem('theme');
	if (storedTheme) return storedTheme;

	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

function setTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);

	const toggle = document.getElementById('themeToggle');
	const icon = toggle.querySelector('.theme-toggle-icon');
	const text = toggle.querySelector('.theme-toggle-text');

	if (theme === 'dark') {
		icon.textContent = '☀️';
		text.textContent = 'Light';
	} else {
		icon.textContent = '🌙';
		text.textContent = 'Dark';
	}
}

// Initialize theme
setTheme(getPreferredTheme());

// Theme toggle event listener
document.getElementById('themeToggle').addEventListener('click', () => {
	const currentTheme =
		document.documentElement.getAttribute('data-theme') ||
		getPreferredTheme();
	setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Listen for system theme changes
window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			setTheme(e.matches ? 'dark' : 'light');
		}
	});
