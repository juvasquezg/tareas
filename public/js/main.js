var Esperar = { color: 'black' };
var Listo = { color: 'red', textDecoration: 'line-through' };
var uri = 'http://localhost:3000' + '/tareas/'

var ListaTareas = React.createClass({
  CrearElementosDeLista: function (itemText) {
    return <li className="ui-state-default list-group-item"> 
            <div className="col-md-11">
            <input type="checkbox" ref={itemText.id} onChange={ this.props.EstadoTareaRealizada.bind(this, itemText)} checked={ itemText.estatus == 0?true:false} />
               <span style={itemText.estatus == 0? Listo :Esperar}> &nbsp;{ itemText.titulo} </span>
            </div>
            <a className="btn btn-danger" onClick={this.props.EstadoBorrar.bind(this, itemText)} >x</a>
            </li>;
    },
  render: function() {
    return <ul id="sortable" className = "list-unstyled" > {this.props.ElementosLista.map(this.CrearElementosDeLista)}</ul>;
  }
});

var AplicacionTareas = React.createClass({
  getInitialState: function() { 
    return {ElementosLista: ["Elemento 1","Elemento 2"], text: ''};
  },
  componentWillMount:function() {
    this.actualizarInformacion();
  },
  actualizarInformacion:function() {
    $.get(uri, function(resultado) {
      console.log(resultado.tareas);
      this.setState({ElementosLista:resultado.tareas});
    }.bind(this));
  },
  EstadoBorrar: function(ElementoAborrar, e) {
    console.log(ElementoAborrar);
    $.ajax({
      url: uri + ElementoAborrar.id,
      dataType:'json',
      type:'DELETE',
      success:function(data){ }.bind(this)
    });
    this.actualizarInformacion();
  },
  EstadoCambio: function(e) {
    this.setState({text: e.target.value});
  },
  EstadoTareaRealizada: function(ElementoModificar, e) {
    var indice = this.state.ElementosLista.indexOf(ElementoModificar);
    var valorEstatus=this.state.ElementosLista[indice].estatus=(this.state.ElementosLista[indice].estatus==1)?0:1;
    $.ajax({
      url: uri + ElementoModificar.id,
      contentType:"application/json",
      dataType:'json',
      type: 'PUT',
      data: JSON.stringify( {
              tarea:{
                estatus: valorEstatus
              }
            }), 
      success: function(data) {}.bind(this)
    });
    this.setState({ElementosLista: this.state.ElementosLista});
    this.actualizarInformacion();
  },
  EstadoSubmit: function(e) {
    $.ajax({
      url: uri,
      contentType:"application/json",
      dataType:'json',
      type:'POST',
      data: JSON.stringify( {
              tarea:{
                titulo: this.state.text,
                estatus: 1
              }
            }),
      success:function(data){ }.bind(this)
  });
  this.actualizarInformacion();
  },
  render: function() {
    return (
      <div>
        <h3>Lista de Tareas</h3>

        <form onSubmit={this.EstadoSubmit} >
          <input className="form-control" placeholder="Agregar a la lista"  onChange={this.EstadoCambio} value={this.state.text} />
          <br/>
          <input type="button" onClick={this.EstadoSubmit}  className="btn btn-success btn-block " value={'Agregar a lista'} />
          <input type="button" className="btn btn-default" value= {(this.state.ElementosLista.length )} />
</form>
        <hr/>
        <ListaTareas ElementosLista={this.state.ElementosLista}  
          EstadoBorrar={this.EstadoBorrar} EstadoTareaRealizada={this.EstadoTareaRealizada} />
      </div>
    );
  }
});

React.render(<AplicacionTareas />, document.getElementById('Tareas'));