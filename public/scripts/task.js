$(document).ready(function() {

  function loadCategories() {
    $.ajax('/api/categories', { method: 'GET' })
        .then(function(data) {
          return data;
        })
    // This then create the edit multiple choices
    .then(function (data)  {
      $( ".edit_sign" ).click(function(event) {
        event.preventDefault();
        const $editIcon = $(this);
        const $editForm = $editIcon.parent( ".edit_form" );
        const $divElement = $editForm.parent();
        const $taskElementChild = $divElement.parent("#task_element_child");
        const $taskElement = $taskElementChild.parent(".task_element");
        const $taskDescription = $taskElement.find("#p_task_description").html();


        $('.edit_form').empty();
        const $multipleChoice = `
        <form id="form_multiple_choice" action="/edit" method="post">
        <input type="radio" name="${data.categories[0].type}" value="${$taskDescription}"/> ${data.categories[0].type}
        <input type="radio" name="${data.categories[1].type}" value="${$taskDescription}"/> ${data.categories[1].type}
        <input type="radio" name="${data.categories[2].type}" value="${$taskDescription}"/> ${data.categories[2].type}
        <input type="radio" name="${data.categories[3].type}" value="${$taskDescription}"/> ${data.categories[3].type}
        <input type="image" name="checked" id="checked"   class="checked" src="https://img.icons8.com/fluent/48/000000/checkmark.png"  alt="submit">
        </form>
        `;
        $($taskElement).append($multipleChoice);
      });
    })
  };

  const loadTask = () => {
    $.ajax('/api/join', { method: 'GET' })
      .then(function(data) {
        $('#task_article').empty();
        return data;
      })
      .then((data) => {

        //this part of convert all the catergories into html
        const typeArr = [];
        for (let element of data.join) {

          if (typeArr.indexOf(element.type) >= 0){
            continue;
          }
          typeArr.push(element.type);
          const $category = $(`
          <p class="p_category" id="${element.type.slice(3)}"> ${element.type} </p>
          `);
          $('#task_article').prepend($category);
        }


        for (let element of data.join) {
          const $task =
          $(`
          <div class="task_element">
            <div id="task_element_child">
              <div>
                <p id="p_task_description"> ${element.task_description[0].toUpperCase()}${element.  task_description.slice(1).toLowerCase()} </p>
              </div>
              <div id="icon">
                <form  action="/delete" method="POST">
                  <input type="image" name="${element.task_description}" class="input_button delete"  src="https:/img.icons8.com/color/48/000000/delete-sign.png" alt="Submit">
                </form>
                <form id="edit_form" class= "edit_form">
                  <input type="image" name="${element.task_description}"  class="input_button edit_sign" src="https://img.icons8.com/pastel-glyph/64/000000/edit.png"  alt="submit">
                </form>
              </div>
            </div>


          </div>

        `);
        $(`#${element.type.slice(3)}`).append($task);

        }
      })
      .then (function () {
        loadCategories();
      })
    };

    loadTask();

  // this part resposible for getting data from text input
  $("#submit_form").submit(function(event) {
    const $form = $("form");
    loadTask();
  });

});
