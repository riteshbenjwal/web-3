use std::fs::read_to_string;

pub fn main() {
    match read_from_file(String::from("a.txt")) {
        Ok(data) => println!("File content:\n{}", data),
        Err(err) => println!("Error: {}", err),
    }
}

fn read_from_file(file_path: String) -> Result<String, String> {
    let result = read_to_string(file_path); // Result
    result.map_err(|err| format!("Failed to read file: {}", err))
}
