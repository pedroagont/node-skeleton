/* eslint-disable no-undef */
$(() => {
  // Note Html Markup
  const createNoteElement = (note) => {
    const { id, content } = note;
    return `<article class="note">
              <form class="update-form" data-id=${id}>
                <input type="text" id="content" name="content" value="${content}" autocomplete="off" required>
                <button class="edit-btn" type="submit">Edit</button>
              </form>
              <button class="delete-btn" data-id=${id}>Delete</button>
            </article>`;
  };

  // Rendering function
  const renderNotes = (notes) => {
    const notesList = [];

    for (const n of notes) {
      const newNote = createNoteElement(n);
      notesList.push(newNote);
    }

    $('#notes-list').empty().append(notesList);
  };

  // CRUD Handlers
  // Create
  const handleSubmitNote = function (e) {
    const input = $(this).find('input[name="content"]');
    e.preventDefault();
    const body = {
      content: input.val(),
    };

    $.ajax({
      method: 'POST',
      url: '/api/notes',
      data: body,
    })
      .done((response) => {
        const { note } = response;
        if (!note) {
          return $('#error').text('Error creating note');
        }

        input.val('');
        $('#error').text('');
        fetchMyNotes();
      })
      .fail((err) => {
        $('#error').text(`Error creating note: ${err.responseJSON.message}`);
      });
  };

  // Read
  const fetchMyNotes = () => {
    const userId = $('#notes-list').attr('data-id');

    $.ajax({
      method: 'GET',
      url: `/api/notes?user_id=${userId}`,
    }).done((response) => {
      // Render received data
      renderNotes(response.notes);
      // After rendering the notes we can now add their corresponding event listeners
      $('.update-form').submit(handleUpdateNote);
      $('.delete-btn').click(handleDeleteNote);
    });
  };

  // Update
  const handleUpdateNote = function (e) {
    e.preventDefault();
    const body = {
      content: $(this).find('input[name=content]').val(),
    };

    const id = $(this).attr('data-id');
    $.ajax({
      method: 'POST',
      url: `/api/notes/${id}/edit`,
      data: body,
    })
      .done(() => {
        const message = $('#message');
        message.show().text('Note updated!');
        setTimeout(() => message.hide().text(''), 3000);
      })
      .fail((err) => {
        $('#error').text(`Error updating: ${err.responseJSON.message}`);
      });
  };

  // Delete
  const handleDeleteNote = function (e) {
    e.preventDefault();

    const id = $(this).attr('data-id');
    $.ajax({
      method: 'POST',
      url: `/api/notes/${id}/delete`,
    })
      .done(() => {
        $(this).parent().remove();
        const message = $('#message');
        message.text('Note deleted!').show();
        setTimeout(() => message.hide().text(''), 3000);
      })
      .fail((err) => {
        $('#error').text(`Error deleting: ${err.responseJSON.message}`);
      });
  };

  // Logout button
  const handleLogout = (e) => {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: `/api/users/logout`,
    })
      .done(() => {
        // To change current url using LOCATION API
        // window.location.href = '/login';
        window.location.assign('/login');
      })
      .fail((err) => {
        $('#error').text(`Error logging out: ${err.responseJSON.message}`);
      });
  };

  // Start function
  const start = () => {
    $('#new-note').submit(handleSubmitNote);
    $('#logout').submit(handleLogout);
    fetchMyNotes();
  };

  start();
});
