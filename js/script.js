const input = document.getElementById('textInput');
const preview = document.getElementById('preview');
const count = document.getElementById('count');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

function updatePreview() {
  const value = input.value;
  count.textContent = `${value.length} ${value.length === 1 ? 'character' : 'characters'}`;
}

function respond() {
    const value = input.value;
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            if (value in data) {
                preview.innerHTML = data[value];
                fetch("YOUR_GOOGLE_SCRIPT_URL", {
                  method: "POST",
                  body: value
                })
                .then(res => res.text())
                .then(txt => console.log(txt))
                .catch(err => console.error(err));
            } else {
                preview.innerHTML = '<span>No matching key found.</span>';
            }
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            preview.innerHTML = '<span>Error loading data.</span>';
        });
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    updatePreview();
    respond();
  }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(input.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy to clipboard'), 1200);
  } catch (err) {
    copyBtn.textContent = 'Copy not allowed';
    setTimeout(() => (copyBtn.textContent = 'Copy to clipboard'), 1500);
  }
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  updatePreview();
  input.focus();
});

// Initialize state
updatePreview();
