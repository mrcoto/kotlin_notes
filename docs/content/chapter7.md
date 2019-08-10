# Capítulo 7: Null Safety, Reflections and Annotations

## Safe null access

~~~kotlin
fun main() {
    class City(val name: String)
    class Address(val name: String, val city: City?)
    class Person(val name: String, val address: Address?)
    val person1 = Person("Arturito", Address("Wallaby", City("La Serena")))
    val person2 = Person("Arturito", null)
    println("${person1.address?.city?.name}") // La Serena
    println("${person2.address?.city?.name}") // null
    val address1 = person1.address!! // De tipo Address y no Address?
    val address2 = person2.address!! // NullPointerException ( es null )
}
~~~

## Operador Elvis

~~~kotlin
fun main() {
    class City(val name: String)
    class Address(val name: String, val city: City?)
    class Person(val name: String, val address: Address?)
    val person1 = Person("Arturito", Address("Wallaby", City("La Serena")))
    val person2 = Person("Arturito", null)

    val address1 = person1.address ?: Address("default", City("default"))
    val address2 = person2.address ?: Address("default", City("default"))

    println(address1.name) // Wallaby
    println(address2.name) // default
}
~~~

## Optional

~~~kotlin
fun main() {
    val opt: Optional<String> = Optional.empty()
    println(opt.orElse("nada")) // nada
}
~~~

## Reflection

Inspecciona código en tiempo de ejecución (runtime)
- KClass: cada tipo tiene una instancia de KClass con información de funciones,
propiedades, anotaciones y de la misma clase.

~~~kotlin
import kotlin.reflect.full.memberProperties

fun main() {
    class Person(val firstName: String, val lastName: String)
    val person = Person("Artu", "Rito")
    val kperson = person::class
    println(kperson.memberProperties.map { it.name }) // [firstName, lastName]
}
~~~

## Instanciación usando Reflexión

~~~kotlin
import kotlin.reflect.KClass
import kotlin.reflect.full.createInstance

fun main() {
    class Person(val firstName: String = "Artu", val lastName: String = "Rito")
    fun createPerson(kperson: KClass<Person>): Person = kperson.createInstance()
    val person = createPerson(Person::class)
    println("${person.firstName} ${person.lastName}") // Artu Rito
}
~~~

## Invocar función usando Reflexión

~~~kotlin
import kotlin.reflect.full.functions

fun main() {
    class Person(val firstName: String, val lastName: String) {
        fun fullName(): String = "$firstName $lastName"
    }
    val person = Person("Artu", "Rito")
    val func = Person::class.functions.find { it.name == "fullName" }
    println(func?.call(person)) // Artu Rito

}
~~~

## Anotaciones

Las anotaciones son etiquetas que añaden metadata a clases, funciones o propiedades
para darles un significado adicional
~~~kotlin
import kotlin.reflect.full.functions

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Prefix(val prefix: String)

fun main() {
    class Person(val firstName: String, val lastName: String) {
        @Prefix("Dr.") fun fullName(): String = "$firstName $lastName"
    }
    val person = Person("Artu", "Rito")
    val func = Person::class.functions.find { it.name == "fullName" }
    val prefixAnnotation = func?.annotations?.find { it.annotationClass.simpleName == "Prefix" } as Prefix?
    val prefix = prefixAnnotation?.prefix ?: ""
    println("$prefix ${func?.call(person)}") // Dr. Artu Rito
}
~~~