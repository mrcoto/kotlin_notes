# Capítulo 8: Generics

## Funciones parametrizadas

~~~kotlin
import kotlin.random.Random

fun main() {
    // T en este caso está siendo un String (no necesariamente debe ser T)
    fun<T> random(vararg args: T): T = args[Random.nextInt(args.size)]
    val str = random("a", "b", "c", "d", "e", "f")
    println(str)
}
~~~

## Upper Bound
~~~kotlin
fun main() {
    fun<T : Comparable<T>> min(first: T, second: T): T = if (first.compareTo(second) <= 0) first else second
    println(min(5, 4)) // 4
    println(min("abc", "def")) // abc
    println(min(1 to 10, 2 to 20)) // Error
}
~~~

## Multiple Bound
~~~kotlin
import java.io.Serializable

fun main() {
    // Comparables y Serializables
    fun<T> min(first: T, second: T): T where T : Comparable<T>, T : Serializable {
        return if (first.compareTo(second) <= 0) first else second
    }

    println(min(5, 4)) // 4
    println(min("abc", "def")) // abc
}
~~~

## Typevariance

Una tecnica que permite o no permite subtipos en tipos parametrizados.
Si Apple extiende de Fruit, no necesariamente Crate\<Apple\> es un subtipo de Crate\<Fruit\>

### Invariance

Si Apple extiende de Fruit, no necesariamente Crate\<Apple\> es un subtipo de Crate\<Fruit\>

~~~kotlin
fun main() {
    open class Fruit
    class Apple: Fruit()
    class Crate<T>(val elements: MutableList<T>) {
        fun add(element: T) { elements.add(element) }
    }

    val crate = Crate<Apple>(mutableListOf(Apple()))

    fun addToFruitCrate(crate: Crate<Fruit>) { crate.add(Apple()) }
    addToFruitCrate(crate) // No compila
}
~~~

### Covariance

Con el keyword `out` se puede indicar que un Crate de Apple es un subtipo
de un Crate de Fruit.

**Nota:** No puede tener argumentos mutables, ni parámetros 'T' de entrada, y debe tener funciones únicamente
de salida.

~~~kotlin
fun main() {
    open class Fruit
    class Apple: Fruit()
    class Crate<out T>(val elements: List<T>) {
        fun last(): T  = elements.last()
    }

    val crate = Crate<Apple>(mutableListOf(Apple()))

    fun getLast(crate: Crate<Fruit>) { crate.last() }
    getLast(crate) // Compila
}
~~~

### Contravariance

Al contrario, Apple es subtipo de Fruit, pero Crate Apple podría ser
un supertipo de Crate Fruit. Se utiliza `in` para esto.

~~~kotlin
fun main() {
    open class Fruit
    class Apple: Fruit()
    class Crate<in T>(val elements: MutableList<in T>) {
        fun add(element: T)  { elements.add(element) }
    }

    fun doSomething(crate: Crate<Apple>) { println("hi") }

    val crateApple = Crate<Apple>(mutableListOf())
    val crateFruit = Crate<Fruit>(mutableListOf())

    doSomething(crateApple)
    doSomething(crateFruit) // ok (Crate<Fruit> es subtipo de Crate<Apple>
}
~~~

## Nothing Type

`Any` es supertipo de todos los tipos, pero `Nothing` es subtipo de todos los 
tipos. Útil para usar con covarianza.