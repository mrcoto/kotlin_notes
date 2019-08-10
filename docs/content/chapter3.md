# Capítulo 3: Funciones

Las funciones se pueden declarar de forma tradicional en un bloque de expresión,
o expesiones singulares.
~~~kotlin
fun sqr(x: Int): Int {
    return x * x
}

fun cube(x: Int): Int = x*x*x
~~~

También se pueden definir funciones dentro de otras funciones y
asignar a las variables.
~~~kotlin
fun main() {
    fun cube(x: Int): Int = x*x*x // dentro de main()
    val calcCube = ::cube // se asigna referencia de la función
    println(cube(3)) // 9
    println(calcCube(2)) // 8
}
~~~

## Named Parameters & Default Parameters

Para evitar la sobrecarga de métodos como en Java, kotlin ofrece valores
de argumentos por defecto e asignación de parámetros por nombre.
~~~kotlin
fun main() {
    fun padLeft(str: String, symbol: String = "0", n: Int): String {
        return symbol.repeat(n - str.length) + str
    }
    println(padLeft("42", n = 5)) // 00042
}
~~~

## Extension Functions

Las funciones de extensión añaden nueva funcionalidad a métodos de objetos ya existentes.
Si la función se marca con **open**, entonces puede ser sobreescrita
por los subclases que heredan a esta.
~~~kotlin
fun main() {
    class Integer(val x: Int)
    open fun Integer.sqr(): Int = this.x * this.x // Función de extension

    val num = Integer(4)
    println(num.sqr()) // 16

    fun String.noVowels(): String = this.replace("[aeiouAEIOU]".toRegex(), "")
    val str = "murcielago".noVowels()
    println(str) // mrclg
}
~~~

## Multiple return values

Para retornar más de un valor existen **Pair**, **Triple** y 
**MultiComponent** (para más de 3). La ventaja, es que permite la
destructuración
~~~kotlin
fun main() {
    // o = str.toLowerCase() to str.toUpperCase()
    fun lowerAndUpper(str: String): Pair<String, String> = Pair(str.toLowerCase(), str.toUpperCase())
    val conv = lowerAndUpper("Sheep")
    println("${conv.first} ${conv.second}") // sheep SHEEP
    val (lower, upper) = conv // destructuración
    println("$lower $upper") // sheep SHEEP
}
~~~

## Infix Function

Las funciones infix permiten escribir código más legible.
Por ahora solo se permite leer una línea.
**Solo se pueden generar infix function si la función posee un argumento sin valor por defecto**
~~~kotlin
fun main() {
    class DB() {
        var query: String = ""
        infix fun select(args: String): DB { query += "SELECT $args"; return this }
        infix fun from(table: String): DB { query += " FROM $table"; return this }
        infix fun whereId(id: Int): DB { query += " WHERE id = $id"; return this }
    }
    var db1 = DB()
    var db2 = DB()
    db1 = db1.select("id, first_name").from("employee").whereId(2)
    db2 = db2 select "id, first_name" from "employee" whereId 2
    println(db1.query) // SELECT id, first_name FROM employee WHERE id = 2
    println(db2.query) // SELECT id, first_name FROM employee WHERE id = 2
}
~~~

## Operadores

En kotlin se pueden sobreescribir operadores para clases, 
por ejemplo, en vez de hacer Integer.add(Integer) se puede hacer Integer + Integer.

~~~kotlin
fun main() {
    class Point(val x: Int, val y: Int) {
        operator fun plus(p: Point): Point = Point(x + p.x, y + p.y)
        override fun toString(): String = "($x, $y)"
    }
    val p1 = Point(2, 5)
    val p2 = Point(-5, 6)
    println(p1 + p2) // (-3, 11)
}
~~~

La lista posible de operadores es la siguiente:

|Expresión|Función|
|---|---|
|+a|a.unaryPlus()|
|-a|a.unaryMinus()|
|!a|a.not()|
|a++|a.inc()|
|a--|a.dec()|
|a + b|a.plus(b)|
|a - b|a.minus(b)
|a * b|a.times(b)
|a / b|a.div(b)
|a % b|a.rem(b), a.mod(b) (deprecated)
|a..b|a.rangeTo(b)
|a in b|b.contains(a)
|a !in b|!b.contains(a)
|a[i]|a.get(i)
|a[i, j]|a.get(i, j)
|a[i_1, ..., i_n]|a.get(i_1, ..., i_n)
|a[i] = b|a.set(i, b)
|a[i, j] = b|a.set(i, j, b)
|a[i_1, ..., i_n] = b|a.set(i_1, ..., i_n, b)
|a()|a.invoke()
|a(i)|a.invoke(i)
|a(i, j)|a.invoke(i, j)
|a(i_1, ..., i_n)|a.invoke(i_1, ..., i_n)
|a += b|a.plusAssign(b)
|a -= b|a.minusAssign(b)
|a *= b|a.timesAssign(b)
|a /= b|a.divAssign(b)
|a %= b|a.remAssign(b), a.modAssign(b) (deprecated)
|a == b|a?.equals(b) ?: (b === null)
|a != b|!(a?.equals(b) ?: (b === null))
|a > b|a.compareTo(b) > 0
|a < b|a.compareTo(b) < 0
|a >= b|a.compareTo(b) >= 0
|a <= b|a.compareTo(b) <= 0

## Varargs

En vez de utilizar los "tres puntitos" para indicar multiple variables,
se puede utilizar la keyword "vararg"
~~~kotlin
fun main() {
    fun log(vararg args: Any): Unit {
        args.forEach { print("$it ") }
        println()
    }
    log("Hello", 2, 4, listOf(10, 20)) // Hello 2 4 [10, 20] 
    log(*arrayOf("A", "B", "C")) // * -> spread operator
}
~~~

## Standard Library Functions

Funciones que incluyen: Apply, Let, With, Run, Lazy, Use, Repeat y Require

### Apply
con Apply se pueden recibir funciones de clase dentro de un closure que se **aplican** a 
la instancia que está llamando el método apply.
~~~kotlin
fun main() {
    class App(val name: String) {
        private var background: Boolean = false
        fun setBackground(background: Boolean) {this.background = background}
        fun execute() { println("Ejecutando $name [Background: $background]") }
    }
    App("script.py").apply { setBackground(true) }.execute() // Ejecutando script.py [Background: true]
}
~~~

### Let
Similar a apply, permite ejecutar funciones dentro del closure y luego retornar
un objeto. Es útil ya que no existen variables intermedias.
~~~kotlin
fun main() {
    class Box(var width: Int, var height: Int) {
        fun double() { width *=2 ; height *=2 }
        fun toPair(): Pair<Int, Int> = width to height
    }
    val pair = Box(4, 6).let {
        it.double()
        it.toPair() // Comenzó como Box, pero termina retornando un Pair<Int, Int>
    }
    println("${pair.first} ${pair.second}") // 8 12
}
~~~

### With
With es un bloque de expresión que acepta un objeto parámetro, y que permite
llamar las funciones de dicho objeto directamente sin tener que acceder a través del objeto.
(en vez de hacer persona.saltar(), se puede hacer simplemente saltar())
~~~kotlin
fun main() {
    val list = mutableListOf<Int>()
    with(list) {
        add(4) // en vez de hacer list.add(4)
        add(5)
        remove(4)
    }
    println(list) // [5]
}
~~~

### Run
Run es una combinación de With y let
~~~kotlin
fun main() {
    class Box(var width: Int, var height: Int) {
        fun double() { width *=2 ; height *=2 }
        fun toPair(): Pair<Int, Int> = width to height
    }
    val pair = Box(4, 6).run {
        double()
        toPair()
    }
    println("${pair.first} ${pair.second}") // 8 12
}
~~~

### Lazy
Lazy permite ejecutar funciones o código cuando se requiera y no al momento
de declararse. Útil para funciones costosas.
~~~kotlin
fun main() {
    val upper = lazy { "hello".toUpperCase() }
    println(upper) //[SynchronizedLazyImpl] Lazy value not initialized yet.
    println(upper.value) // con value ejecuta la función
    println(upper) // HELLO
}
~~~

### Use
Use se usa como un try-with-resources de Java. En vez de cerrar explicitamente una conexión,
o al terminar de usar un File, con use se cierra automáticamente.
~~~kotlin
fun main() {
    val out = File("hello.txt").printWriter().use {
        it.write("Hello World")
    } // ejecuta .close solo
}
~~~

### Repeat
Permite ejecutar un bloque de código N veces
~~~kotlin
fun main() {
    var x = 2
    repeat(9) { x *= 2 }
    println(x) // 1024
}
~~~

### Require
Permite validar argumentos. Lanza una excepción InvalidArgumentException
si no se cumple
~~~kotlin
fun main() {
    fun onlyPositive(x: Int) {
        require(x > 0) {"$x debe ser positivo"}
    }
    onlyPositive(4) // ok
    onlyPositive(-4) // InvalidArgumentException
}
~~~

## Pure Functions
Una función pura debe retornar siempre la misma salida, para una misma entrada,
y además no debe contener efectos secundarias
~~~kotlin
fun main() {
    // impuro, ya que además imprime x
    fun myAbs(x: Int): Int {
        println(x)
        return abs(x) // abs es puro
    }
    myAbs(-4)
}
~~~