# Capítulo 6: Properties

Propiedades simples de una clase:
~~~kotlin
fun main() {
    class Employee(name: String, age: Int) {
        public var Name = ""
        set(value) {
            field = value
        }

        public var Age = 15
        set(value) {
            field = value
        }

        init {
            Name = name
            Age = age
        }
    }
    val emp = Employee("Arturito", 20)
    emp.Age+=1
    println("${emp.Name} ${emp.Age}") // Arturito 21
}
~~~

Segundo ejemplo
~~~kotlin
interface Shape {
    val Area: Double
}

class Rectangle(val width: Double, val height: Double): Shape {
    override val Area: Double
        get() = width * height
}

fun main() {
    val rect = Rectangle(2.2, 4.5)
    println("Area: ${rect.Area}") // 9.9
}
~~~

## Late Initialization

Late initialization te permite asignar por primera vez valores no-null
no necesariamente al momento de instanciar la clase.
Hay dos restricciones:
- No debe ser un tipo primitivo
- No debe tener setter/getter customizado
~~~kotlin
fun main() {
    class Client(val name: String)
    class Invoice() {
        lateinit var client: Client
        fun initProperty(client: Client): Unit { this.client = client }
    }
    val invoice = Invoice()
    // println(invoice.client.name) // UninitializedPropertyAccessException
    invoice.initProperty(Client("Arturito"))
    println(invoice.client.name) // Arturito
}
~~~

## Delegating Properties

La delegación en kotlin soporta:
- La propiedad es lazy en el primer acceso
- Notifica cambios al cambiar una de sus propiedades
- Utiliza un map para almacenar los campos, más que un campo materializado
~~~kotlin
import kotlin.reflect.KProperty

fun main() {
    class DoublerDelegate {
        private var number = 0L
        operator fun getValue(ref: Any?, property: KProperty<*>): Long = number * 2
        operator fun setValue(ref: Any?, property: KProperty<*>, value: Long) {
            number = value
        }
    }
    class Measure {
        var value: Long by DoublerDelegate()
    }
    val measure = Measure()
    measure.value = 2 // value es 2, pero al delegarse, se imprimirá 4
    println(measure.value) // 4
}
~~~

Otro ejemplo, implementando map

~~~kotlin
fun main() {
    class Employee(val map: Map<String, Any?>) {
        val name: String by map
        val age: Int by map
    }

    val emp = Employee(mapOf("name" to "Arturito", "age" to 20))
    println("${emp.name} ${emp.age}") // Arturito 20

}

~~~

## Lazy initialization

Se puede indicar que una variable tenga una asignación cuando se le de 
su primer uso, de esta forma aumenta el rendimiento y disminuye la memoria utilizada.

A diferencia de `lateinit`, `lazy` solo puede ser usada en propiedades
con `val` y `lateinit` con `var`.

~~~kotlin
fun main() {
    class Employee() {
        val name: String by lazy {
            println("Asignado por primera vez")
            "Sin Nombre"
        }
    }

    val emp = Employee()
    println(emp.name) // imprime "Asignado por primera vez" y "Sin Nombre"
    // Como ya asignó el valor, aquí solo imprime "Sin Nombre"
    println(emp.name)
}
~~~

## Observables

Se pueden utilizar observables para saber si una propiedad delegada
ha sido cambiada.
~~~kotlin
import kotlin.properties.Delegates
import kotlin.reflect.KProperty

fun main() {
    class AuditChange {
        var field: String by Delegates.observable("") { p, old, new ->
            println("ha cambiado de '$old' a '$new'")
        }
        operator fun getValue(ref: Any?, property: KProperty<*>): String = field
        operator fun setValue(ref: Any?, property: KProperty<*>, value: String) {field = value}
    }
    class Employee {
        var name: String by AuditChange()
    }
    val emp = Employee()
    emp.name = "Arturito" // ha cambiado de '' a 'Arturito'
    emp.name = "Jon Snow" // ha cambiado de 'Arturito' a 'Jon Snow'
    println(emp.name) // Jon Snow
}
~~~