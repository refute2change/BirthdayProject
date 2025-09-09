const input = document.getElementById('textInput');
const preview = document.getElementById('preview');
const count = document.getElementById('count');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const ipHolder = document.getElementById('ipHolder');

function updatePreview() {
  const value = input.value;
  count.textContent = `${value.length} ${value.length === 1 ? 'character' : 'characters'}`;
}

function fetchip() {
  fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    let ip = data["ip"];
    console.log(ip);
    ipHolder.innerHTML = ip;
  })
  .catch(err => console.error(err));
}

function respond() {
    const value = input.value;
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            if (value in data) {
                preview.innerHTML = data[value];
                fetch("https://script.google.com/macros/s/AKfycbzkoG-EciIP1BR-Mo9BTfQcVMDNS3s74ubZOjZYu-Z6Ujwp5smM2NcmYkUvVC4zyQkn/exec", {
                  method: "POST",
                  body: JSON.stringify({ "Word": value, "By": ipHolder.textContent })
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
            preview.innerHTML = error;
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
fetchip();