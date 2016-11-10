module Example00 where

data ℕ : Set where
  zero : ℕ
  succ : ℕ → ℕ

add : ℕ → ℕ → ℕ
add zero n = n
add (succ m) n = succ (add m n)
