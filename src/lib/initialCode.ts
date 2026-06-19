export const INITIAL_CODE = `# Ruby Pocket Runner へようこそ!
# Run ボタンを押すとこのコードがブラウザ内で実行されます。

def fizzbuzz(n)
  if n % 15 == 0
    "FizzBuzz"
  elsif n % 3 == 0
    "Fizz"
  elsif n % 5 == 0
    "Buzz"
  else
    n.to_s
  end
end

(1..20).each do |i|
  puts fizzbuzz(i)
end
`;
