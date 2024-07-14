let list = document.getElementById('list');
let notes = [];

function saveNotes() {
	localStorage.setItem('notes', JSON.stringify(notes));
}

function saveNotePosition(noteElement) {
	const index = Array.from(list.children).indexOf(noteElement);
	const position = {
		left: noteElement.style.left,
		top: noteElement.style.top,
	};
	notes[index].position = position;
	saveNotes();
}

function loadNotePositions() {
	Array.from(list.children).forEach((noteElement, index) => {
		const position = notes[index]?.position;
		if (position) {
			noteElement.style.left = position.left;
			noteElement.style.top = position.top;
		}
	});
}

const savedNotes = JSON.parse(localStorage.getItem('notes'));
if (savedNotes) {
	notes = savedNotes;
}

function addNote() {
	let colorValue = color.value; // Get color value from input
	let note = document.createElement('div');
	note.classList.add('note');
	note.style.borderTop = `30px solid ${colorValue}`;
	note.innerHTML = `
        <span class="close">
            <i class="fas fa-times"></i>
        </span>
        <textarea placeholder="Write Content..." rows="10" cols="30" style="wrap: soft;"></textarea>
    `;

	list.appendChild(note);

	let close = note.querySelector('.close');
	close.addEventListener('click', () => {
		list.removeChild(note);
		removeNoteFromList(note);
	});

	let textarea = note.querySelector('textarea');
	textarea.addEventListener('input', function () {
		updateNoteContent(textarea.value, note);
	});

	// Store note data
	notes.push({
		content: '',
		color: colorValue,
		position: { left: '50px', top: '60px' },
	});
	saveNotes();

	// Set the initial position of the note
	note.style.left = '50px';
	note.style.top = '60px';

	color.value = '#e6b905';

	// Event listeners for dragging
	note.addEventListener('mousedown', (event) => {
		onNoteMouseDown(event, note);
	});

	note.addEventListener('mousemove', (event) => {
		onNoteMouseMove(event, note);
	});
}

function removeNoteFromList(noteElement) {
	const index = Array.from(list.children).indexOf(noteElement);
	notes.splice(index, 1);
	saveNotes();
}

function updateNoteContent(content, noteElement) {
	const index = Array.from(list.children).indexOf(noteElement);
	notes[index].content = content;
	saveNotes();
}

// Call addNote function on button click
createBtn.addEventListener('click', addNote);

// Initialize notes from localStorage
savedNotes.forEach((noteData) => {
	let note = document.createElement('div');
	note.classList.add('note');
	note.style.borderTop = `30px solid ${noteData.color}`;
	note.innerHTML = `
        <span class="close">
            <i class="fas fa-times"></i>
        </span>
        <textarea placeholder="Write Content..." rows="10" cols="30" style="wrap: soft;">${noteData.content}</textarea>
    `;

	list.appendChild(note);

	const textarea = note.querySelector('textarea');
	const closeBtn = note.querySelector('.close');

	closeBtn.addEventListener('click', () => {
		list.removeChild(note);
		removeNoteFromList(note);
	});

	textarea.addEventListener('input', function () {
		updateNoteContent(textarea.value, note);
	});

	// Set the initial position of the note
	note.style.left = noteData.position.left;
	note.style.top = noteData.position.top;

	// Event listeners for dragging
	note.addEventListener('mousedown', (event) => {
		onNoteMouseDown(event, note);
	});

	note.addEventListener('mousemove', (event) => {
		onNoteMouseMove(event, note);
	});
});

let isDragging = false;
let offsetX, offsetY;

function onNoteMouseDown(event, noteElement) {
	isDragging = true;
	offsetX = event.clientX - noteElement.offsetLeft;
	offsetY = event.clientY - noteElement.offsetTop;
}

function onNoteMouseMove(event, noteElement) {
	if (isDragging) {
		noteElement.style.left = event.clientX - offsetX + 'px';
		noteElement.style.top = event.clientY - offsetY + 'px';
		saveNotePosition(noteElement);
	}
}

document.addEventListener('mouseup', () => {
	isDragging = false;
});

window.addEventListener('load', () => {
	loadNotePositions();
});
