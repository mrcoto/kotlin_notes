# Capítulo 4: Higher Order Functions y Programación Funcional

Una higher order function es una función que recibe una función como 
argumento, retorna una función, o ambas.
~~~kotlin
fun main() {
    // Ejemplo 1: Recibe función como parámetro
    fun getFromDB(table: String, callback: (String) -> Unit) {
        println("SELECT * FROM $table")
        callback(table)
    }
    getFromDB("employee") { table -> println("Se ha obtenido datos de: $table") }
    // Ejemplo 2: Retorna función
    fun upperFun(): (String) -> String = { str -> str.trim().toUpperCase() }
    val upper = upperFun() // La llamada retorna una función
    println(upper("hello")) // HELLO
}
~~~

## Closures

Un closure es una función que tiene acceso a variables o parámetros que están
fuera de su alcance.
~~~kotlin
fun main() {
    fun loadList() = listOf(30, 50, 20, 10, 60)
    // loadList() está fuera de su ámbito, por lo tanto es un Closure
    fun greaterThan(x: Int): List<Int> {
        return loadList().filter { it > x } // Función anónima it > x (Int) -> Boolean
    }
    println(greaterThan(30)) // [50, 60]
}
~~~

## Anonymous Functions
Una función anónima es como una función normal que no tiene un nombre asociado.
~~~kotlin
fun main() {
    fun double(y: Int): Int = y * 2

    val list = listOf(30, 50, 20, 10, 60)
        .filter { it > 40 } // [50, 60] <- Anónimo
        .map(fun(k: Int) = k * 2) // [100, 120] <- Anónimo
        .map { n -> n * 3 } // [300, 360] <- Anónimo
        .map { double(it) } // No anónimo
        .map(::double) // No anónimo
    println(list) // [1200, 1440]
}
~~~

## Function-literal receivers
Se pueden definir funciones o recibir parámetros de funciones de extensión especificas
para ciertos objetos, por ejemplo, una función solo para Int o String.
~~~kotlin
fun main() {
    // Función de extensión que aplica para los Int
    val mult = fun Int.(n: Int): Int = this*n
    println(4.mult(5)) // 20
}
~~~

## Function composition

La composición de funciones es una operación que toma dos funciones f y g,
y produce una funciones h(x) = g(f(x)).
~~~kotlin
fun main() {
    // f(A) -> B
    // g(B) -> C = h(A)
    fun <A, B, C> fog(f: (A) -> B, g: (B) -> C): (A) -> C  = {
        g(f(it)) // it: A
    }
    // Ejemplo: (String) -> Int | (Int) -> Boolean
    val hasDigits = fog<String, Int, Boolean>({ it.count { x -> x.isDigit() } }, {it > 0})

    println(hasDigits("a2b1c")) // True
    println(hasDigits("abc")) // False
}
~~~

## Inline Functions
Como la función es una instancia de un objeto, la memoria es alojada en el Heap,
una forma de evitar esto es utilizar **inline**, esto le dice al compilador
de kotlin que en ciertos casos en vez de generar más instancias de funciones
dentro de funciones, coloque explicitamente un bloque de función.
~~~kotlin
inline fun doSomething(callback: () -> Unit) {
    println("something")
    callback()
}

fun main() {
    doSomething { println("Hola") }
    // En vez de alojar memoria de callback en el heap, reemplaza println("Hola")
    // Directamente en doSomething, como si la definición quedará así:
    //    inline fun doSomething(callback: () -> Unit) {
    //        println("something")
    //        println("Hola")
    //    }
}
~~~

## Currying
El currying es una técnica para transformar una función con dos parámetros o más,
en funciones que acepten un solo parámetro.
~~~kotlin
fun main() {
    // Not curried
    fun log(msg: String, level: Level) : Unit = println("$level: msg")
    log("Hola", Level.INFO) // INFO: Hola
    // Curried
    fun curriedLog(): (String) -> (Level) -> Unit = {
        msg -> {
            level -> log(msg, level)
        }
    }
    curriedLog()("Error Inesperado")(Level.WARN)
}
~~~

## Memoization
Memoization es una técnica para cachear resultado y reutilizarlo
(Programación dinámica).
~~~kotlin
fun main() {
    val cache = mutableMapOf<Int, Long>()
    fun fib(k: Int): Long {
        return cache.getOrPut(k) {
            when(k) {
                0 -> 1
                1 -> 1
                else -> fib(k - 1) + fib(k - 2)
            }
        }
    }
    println(fib(12))
    println(fib( 100)) // Normalmente en fib(12) ~ fib(15) se cae
}
~~~

## Type Alias
Se le puede dar un alias a un tipo ya definido.
~~~kotlin
class Employee(val fistName: String, val lastName: String)
typealias Emp = Employee

fun main() {
    val employees = Emp("Artu", "Rito")
}
~~~