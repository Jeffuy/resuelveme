import '@styles/create.css'
const Create = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Create Quiz</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
      />
      <div>
        <form>
          <h1>CREATE QUIZ</h1>
          <label htmlFor="">Title</label>
          <input type="text" />
          <label htmlFor="">Description</label>
          <textarea rows={2} defaultValue={""} />
          <label htmlFor="">Solve Winning message</label>
          <textarea rows={2} defaultValue={""} />
          <label htmlFor="">Amount of life</label>
          <input type="number" min={0} />
          <br />
          <hr />
          <div>
            <h1>
              Questions
              <button className="quiz-form-btn">
                <i className="fa fa-plus" />
              </button>
            </h1>
            <div>
              <label htmlFor="">Question #1</label>
              <button>
                <i className="fa fa-ban" />
              </button>
              <textarea rows={2} defaultValue={""} />
              <section>
                <label htmlFor="">Answer</label>
                <input type="text" />
                <button>
                  <i className="fa fa-plus" />
                </button>
                <input type="text" />
              </section>
              {/* Boton para agregar respuesta validar que no este vacio */}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
