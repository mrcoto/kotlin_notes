# Capítulo 1: Comenzando

~~~kotlin
fun main(args: Array<String>) {
    println("Hola Mundo!")
}
~~~

## Declaración de Variables

Se utilizan las keyword `val` y `var`, el primero **inmutable** (read-only)
y el segundo **mutable**.

~~~kotlin
val inmutable: Int = 2
var mutable: String = "Hello"
mutable = "World"
val number = 12.4 // Inferencia de tipo, number: Double
println(number::class.simpleName); // Double
~~~

**Nota:** La impresión del tipo requiere `compile "org.jetbrains.kotlin:kotlin-reflect:1.3.41"` en el classpath

Asignar a un string un **raw string**, usando doble comilla triple y combinado con los **string templates** ($id en el ejemplo).
~~~kotlin
val id = 8
val paragraph = """
        SELECT id, name
        FROM customer
        WHERE id = $id
    """.trimIndent()
~~~

En Kotlin, todo es un objeto (en Java estaban los tipos primitivos como int o char).

Los tipos de datos básicos en Kotlin son: Long, Int, Short, Byte, Double, Float, Boolean, Char, String y Array.

## Arreglos

Los arreglos se pueden declarar utilizando `arrayOf(argumentos...)` o uno de los tipos que trae Kotlin: 
ByteArray, CharArray, ShortArray, IntArray, LongArray, BooleanArray, FloatArray, y DoubleArray.
~~~kotlin
val array = arrayOf(1, 2, "Hola", 4)  // [1, 2, Hola, 4]
val onlyInts = intArrayOf(1, 2, 3, 4) // [1, 2, 3, 4]
val onlyInts10 = IntArray(3) {k -> k*10} // [0, 10, 20]
~~~

## Paquetes

Al igual que en java se pueden declarar paquetes como:
~~~kotlin
// Archivo com.espin.programming_kotlin.helper.helper.kt
package com.espin.programming_kotlin.helper

fun saltar() {
    println("Estoy Saltando")
}
~~~

Y para importar:
~~~kotlin
import com.espin.programming_kotlin.helper.saltar

fun main(args: Array<String>) {
    saltar()
}
~~~

o utilizando un **alias** (útil cuando dos paquetes usan el mismo nombre)

~~~kotlin
import com.espin.programming_kotlin.helper.saltar as hSaltar

fun main(args: Array<String>) {
    hSaltar()
}
~~~

## Rangos

Un intervalo se define utilizando los dos puntos ".." entre un comienzo
y un final (incluyendo este)
~~~kotlin
val az = "a".."z"
val oneToNine = 1..9
val impares = 9.downTo(1).step(2) // o 9 downTo 1 step 2
println("c" in az) // True
println("C" in az) // False
println(9 in oneToNine) // True
println(11 !in oneToNine) // True
println(4 in impares) // False
println(5 in impares) // True
for(i in impares) {
    println(i) // 9 7 5 3 1
}
~~~

## Equality (Igualdad)

Existen dos tipos para verifiar igualdad **referencialmente** y estructuralmente

~~~kotlin
val a = File("/mobydick.doc")
val b = File("/mobydick.doc")
val referencial = a === b // False. a y b son instancias distintas [!==]
val structural = a == b // True. a y b comparten el mismo valor [!=]
~~~

## Nulls
Para especificar un valor null se debe poner en el sufijo un "?", por ejemplo:
~~~kotlin
var puedoSerNull: String? = null
puedoSerNull = "Hola"
val soyString = puedoSerNull as String // Error si puedoSerNull es null
println(soyString is String) // True
~~~

Sin especificar el "?", el compilador lanzaría un error.

## When

when es la alternativa al switch-case de Java, ejemplo:

~~~kotlin
val value = 1
val valStr = stringRep(value)
println(valStr) // "one"

fun stringRep(value: Int): String {
    return when(value) {
        0 -> "zero"
        1 -> "one"
        2, 3, 4 -> "two up four"
        in 5..9 -> "five up nine"
        else -> "non zero and non one"
    }
}
~~~

Se puede aplicar when también sin argumentos, por ejemplo:
~~~kotlin
val value = 1
val valStr = stringRep(value)
println(valStr) // "one"

fun stringRep(value: Int): String {
    return when {
        value == 0 -> "zero"
        value == 1 -> "one"
        value in listOf(2, 3, 4) -> "two up four"
        value in 5..9 -> "five up nine"
        else -> "non zero and non one"
    }
}
~~~