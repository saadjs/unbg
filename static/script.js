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
