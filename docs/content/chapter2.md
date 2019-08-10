# Capítulo 2: OOP

A diferencia de Java, se pueden definir varias clases en un mismo archivo
(y no un class por archivo en Java)

~~~kotlin
// Constructor con parámetros por defecto
class Employee(val firstName: String = "", val lastName: String = "", private var age: Int = 18) {
    init {
        require(firstName.isNotEmpty()) { "El primer nombre no puede estar vacío" }
    }

    val fullName: String // Declaración de property
        get() = "${this.firstName.toUpperCase()} ${this.lastName.toUpperCase()}"

    fun getAge(): Int = this.age // Inline function
    fun setAge(age: Int): Unit { // Unit es como void, opcional colocarlo
        this.age = age
    }
}

fun main() {
    val employee = Employee("Artu", "Rito") // No hay que colocar new Employee(...)
    println(employee.firstName) // Artu
    println(employee.fullName) // ARTU RITO
    println(employee.getAge()) // 18
    val emp2 = Employee(firstName = "Artu") // firstName: "Artu", lastName: ""
    val emp3 = Employee() // < - Excepción | firstName no puede estar vacio
}
~~~

Una clase por defecto es final (no se puede hereder de esta misma),
para que se puede heredar se debe especificar **open class**.
También soporta las **abstract classes**, clases no instanciables que declaran
funciones que pueden ser sobreescritas para quien herede esta abstract class.

Existen tres niveles de acceso:
- **Internal**: Se puede instanciar una clase únicamente dentro del módulo.
- **Private**: Solo es visible en el alcance del archivo donde está definido.
- **Protected**: Es visible en sub-classes, y no está disponible a nivel-archivo.
- **Public** (Por defecto)

Al igual que Java, existen las **Nested Classes** (clases dentro de otra)

## Data Classes

Si solo se requiere guardar información, kotlin provee las data classes:
~~~kotlin
data class Point(val x: Int, val y: Int)

fun main() {
    val point = Point(10, 20)
}
~~~

## Enum Classes

~~~kotlin
enum class Status { LOW, MEDIUM, HIGH }
enum class Step(val sequence: Int) { START(1), GOING(2), END(3) }

fun main() {
    val status = Status.LOW
    println("${status.name}: ${status.ordinal}") // LOW: 0
    println(Arrays.toString(Status.values())) // [LOW, MEDIUM, HIGH]
    val step = Step.GOING
    println("${step.name}: ${step.sequence} (${step.ordinal})") // GOING: 2 (1)
    println("${Step.valueOf("END").sequence}") // 3
}
~~~

## Singleton

Los singleton en Kotlin se definen con la palabra reservada **object**

~~~kotlin
object Counter {
    private var counter = 0
    fun count() { counter++ }
    fun get(): Int = this.counter
}

fun main() {
    val counter1 = Counter
    counter1.count() // counter: 1
    val counter2 = Counter
    counter2.count() // counter: 2
}
~~~

## Factory

El patrón factory se puede implementar utilizando la keyword **companion object**.
~~~kotlin
class Point (x: Int, y: Int) {
    companion object {
        fun create(): Point = Point(0, 0)
    }
}

interface Instantiable<T> {
    fun create(): T
}
class Dog(name: String) {
    companion object: Instantiable<Dog> { // implementación + generics
        override fun create(): Dog  = Dog("Cachupín")
    }
}

fun main() {
    val point = Point.create()
    val dog = Dog.create()
}
~~~

## Herencia

En kotlin, en vez de utilizar **extends** para heredar, o **implements** para implementar,
se utilizan los dos puntos (:), como en el ejemplo anterior. Sirve tanto para heredar
como para implementar.
~~~kotlin
open class Point2D(val x:Int, val y:Int)
open class Point3D(x:Int, y:Int, val z: Int) : Point2D(x, y)
class Point4D : Point3D {
    var g: Int
    constructor(x: Int, y: Int, z: Int, g: Int): super(x, y, z) {
        this.g = g
    }
}

fun main() {
    val point2d = Point2D(4, 6)
    val point3d = Point3D(4, 5, 6)
    val point4D = Point4D(4, 5, 6, 7)
}
~~~

## Polimorfismo

~~~kotlin
open class Person(val firstName: String, val lastName: String)
enum class SingerTone {LOW, MEDIUM, HIGH}
class Singer(firstName: String, lastName: String, val tone: SingerTone): Person(firstName, lastName)
enum class SoccerPlayerPosition { GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD }
class SoccerPlayer(firstName: String, lastName: String, val position: SoccerPlayerPosition): Person(firstName, lastName)

fun main() {
    val singer = Singer("Barry", "White", SingerTone.HIGH)
    val soccerPlayer = SoccerPlayer("Iker", "Casillas", SoccerPlayerPosition.GOALKEEPER)
    val people = listOf(singer, soccerPlayer) // Person List
    for (person in people) { // person: Person
        if (person is Singer) {
            println(person.tone) // HIGH  | No es necesario castear (Singer) person como en Java
        }
    }
}
~~~

## Delegación
La delegación en Kotlin se puede utilizar con la palabra reservada **by**.
~~~kotlin
interface SoftDeletable {
    fun delete(id: Int): String
}
class SoftDelete(val table: String) : SoftDeletable {
    override fun delete(id: Int): String = "UPDATE $table SET deleted_at = CURRENT_TIMESTAMP WHERE id = $id"
}

// No se es necesario redefinir fun delete(id: Int): String, ya que se lo delega a la instancia "softDelete"
class Employee(softDelete: SoftDelete) : SoftDeletable by softDelete

fun main() {
    val employeeSoftDelete = SoftDelete("employee")
    val employee = Employee(employeeSoftDelete)
    println(employee.delete(2)) // UPDATE employee SET deleted_at = CURRENT_TIMESTAMP WHERE id = 2
}
~~~

## Trait

Los trait a diferencia de la delegación pueden tener propiedades o campos,
pero sin tener un estado (es decir se declaran variables sin tener una asignación).
Es útil para reducir el código de la delegación para que sea más entendible.

~~~kotlin
interface SoftDeletable {
    var table: String // No puedo hacer table = "employee"
    fun delete(id: Int): String = "UPDATE $table SET deleted_at = CURRENT_TIMESTAMP WHERE id = $id"
}
// No se es necesario redefinir fun delete(id: Int): String
class Employee() : SoftDeletable {
    override var table: String = "employee" // Se asigna un estado al trait SoftDeletable
}

fun main() {
    val employee = Employee()
    println(employee.delete(2)) // UPDATE employee SET deleted_at = CURRENT_TIMESTAMP WHERE id = 2
}
~~~

## Sealed Classes

Una sealed class es una clase abstracta (no instanciable) que entrega "superpoderes"
a las enum classes, pudiendo estas contener clases.
~~~kotlin
sealed class Operation() {
    class Add(val x: Int, val y: Int) : Operation()
    class Minus(val x: Int, val y: Int) : Operation()
    fun apply(): Int {
        return when (this) {
            is Add -> this.x + this.y
            is Minus -> this.x - this.y
        }
    }
}

fun main() {
    val op = Operation.Add(3, 6)
    println(op.apply()) // 9
}
~~~