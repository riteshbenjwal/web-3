/*

fn main() {
    let name = String::from("harkirat");
    let len = get_str_len(name);
    println!("the length of the string is {}", len);
}

fn is_even(num: i32) -> bool {
    if num % 2 == 0 {
        return true;
    }
    return false;
}

*/

// Function Declartion, Fibonaci

/*

fn main() {
    println!("{}", fib(4));
}


fn fib(n: u32) -> u32 {
    let (mut first, mut second) = (0, 1);

    if n == 0 {
        return first;
    }

    for _ in 0..(n - 1) {
        let temp = second;
        second += first;
        first = temp;
    }

    second
}

*/

// Struct 

/* 
struct User {
    first_name: String,
    last_name: String,
    age: i32,
}

fn main() {
    let user = User {
        first_name: String::from("Ritesh"),
        last_name: String::from("Benjwal"),
        age: 32,
    };

    println!("{}", user.first_name);
}

*/


// Implementing Structs


/* 
struct Rect {
    width: i32,
    height: i32,
}

impl Rect {
    fn area(&self) -> i32 {
        self.width * self.height
    }

    fn perimeter(&self, num: i32) -> i32 {
        2 * (self.width + self.height)
    }

    fn debug() -> i32 {
        return 1;
    }
}

fn main() {
    let rect1 = Rect {
        width: 10,
        height: 20,
    };

    println!("area is {}", rect1.area());
    println!("perimeter is {}", rect1.perimeter(1));
    // println!("debug is {}", Rect::debug());
    println!("debug is {}", Rect::debug());
}
    
*/

// Enum

enum Shape  {
    Circle(f64),
    Rectangle(f64, f64)
}

fn main(){
    let rect = Shape::Rectangle(1.0, 2.0);
    calculate_area(rect);
    let circle = Shape::Circle(1.0);
    calculate_area(circle);
}
 
 fn calculate_area(shape:Shape) -> f64 {
  let area =  match shape {
        Shape::Rectangle(a,b) => a * b,
        Shape::Circle(r) => 3.14 * r * r
    };
    return area;
 }