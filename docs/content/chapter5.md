# Capítulo 5: DSL

Kotlin proporciona su propio DSL para escribir código fluido, por ejemplo:
~~~kotlin
val query = query {
    select("id")
    select("first_name, last_names")
    from("employee")
    execute()
}
~~~
Esto imprimiría
~~~sql
SELECT id, first_name, last_names
from employee
~~~

Para visualizarlo mejor, se transcribirá a esta forma:
~~~kotlin
val query = query { it ->
    it.select("id")
    it.select("first_name, last_names")
    it.from("employee")
    it.execute()
}
~~~

El primer bloque:
~~~kotlin
val query = query { it ->
    ...
}
~~~
Corresponde a una llamada que recibe una función (Objeto) -> Unit,
donde "it" es la instancia de Objeto, y cada llamada "select" y "from", es un método de esta instancia. Retorna Unit (o Vacío),
ya que solo son llamadas a funciones.
También podría retornar "Objeto", para ejecutar .execute() fuera del contexto
de la función lambda que se le está pasando.
~~~kotlin
class QueryBuilder {

}

fun main() {
    fun query(block: (QueryBuilder) -> Unit) = block(QueryBuilder())

    query {

    }
}
~~~

Ahora se implementan las funciones select, from (de forma simple):
~~~kotlin
class QueryBuilder {
    private var _select = ""
    private var _from = ""

    fun select(columns: String) { _select+= if (_select.isEmpty()) "SELECT $columns" else ", $columns" }
    fun from(table: String) { _from = "FROM $table" }
    fun execute() { println("$_select\n$_from") }
}

fun main() {
    fun query(block: (QueryBuilder) -> Unit) = block(QueryBuilder())

    query {
        it.select("id")
        it.select("first_name, last_names")
        it.from("employee")
        it.execute()
    }
}
~~~

Para evitar hacer llamadas a funciones del tipo "it.execute()" se utilizarán
las "infix functions".

**Nota:** Recordar que solo pueden recibir solo un parámetro como argumento. 

~~~kotlin
class QueryBuilder {
    private var _select = ""
    private var _from = ""

    infix fun select(columns: String) { _select+= if (_select.isEmpty()) "SELECT $columns" else ", $columns" }
    infix fun from(table: String) { _from = "FROM $table" }
    fun execute() { println("$_select\n$_from") }
}

fun main() {
    fun query(block: (QueryBuilder) -> Unit) = block(QueryBuilder())

    query {
        it select "id"
        it select "first_name, last_names"
        it from "employee"
        it.execute()
    }
}
~~~

Otra alternativa, es utilizar el **Contexto del Objeto**

~~~kotlin
class QueryBuilder {
    private var _select = ""
    private var _from = ""

    fun select(columns: String) { _select+= if (_select.isEmpty()) "SELECT $columns" else ", $columns" }
    fun from(table: String) { _from = "FROM $table" }
    fun execute() { println("$_select\n$_from") }
}

fun main() {
    fun query(block: QueryBuilder.() -> Unit): QueryBuilder = QueryBuilder().apply(block)

    query {
        select("id")
        select("first_name, last_names")
        from("employee")
        execute()
    }
}
~~~