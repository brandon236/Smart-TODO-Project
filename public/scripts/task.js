$(document).ready(function() {

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
            <div>
            <p id="p_task_description"> ${element.task_description[0].toUpperCase()}${element.task_description.slice(1).toLowerCase()} </p>
            </div>
            <div>
            <form  action="/delete" method="POST">
              <input type="image" id="${element.task_description}" class="input_button delete" src="https://img.icons8.com/color/48/000000/delete-sign.png" alt="Submit">
            </form>

            <input type="image" id="edit_sign" class="input_button" src="https://img.icons8.com/pastel-glyph/64/000000/edit.png" alt="Submit">
            </div>

          </div>

        `);
        $(`#${element.type.slice(3)}`).append($task);

        }
      });

    };

    loadTask();
  // this part resposible for getting data from text input
  $("#submit_form").submit(function(event) {

    const $form = $("form");
    loadTask();
  });

});

