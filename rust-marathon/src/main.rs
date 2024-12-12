fn main() {
    let ans = fib(10);
    println!("{}", ans);
}

// Function Declartion, check if number is even
// fn is_even(num: i32) -> bool {
//     if num % 2 == 0 {
//         return true;
//     }
//     return false;
// }

// Function Declartion, Fibonaci

fn fib(n: u32) -> u32 {
    let (mut first, mut second) = (0, 1);

    if n == 0 {
        return first;
    }

    for _ in 2..=n {
        let temp = second;
        second += first;
        first = temp;
    }

    second
}