// First Approach: 


/*
pub fn main() {
    println!("Running Option.rs!");
    let index = find_first_a(String::from("ritesh"));
    if  index == -1 {
       println!("e not found");
    } else{
       println!("index is {}", index);
    }
}

fn find_first_a(s:String) -> i32 {
    for (index, char) in s.chars().enumerate(){
        if char == 'e'{
            return index as i32;
        }
    }
  return -1
} 


*/


pub fn main() {
    println!("Running Option.rs!");
    let index = find_first_a(String::from("ritesh"));
    
    match index {
        Some(value) => println!("index is {}", value),
        None => println!("a not found")
        
    }
}

fn find_first_a(s:String) -> Option<i32> {
    for (index, char) in s.chars().enumerate(){
        if char == 'e'{
            return Some(index as i32);
        }
    }
  return None;
} 