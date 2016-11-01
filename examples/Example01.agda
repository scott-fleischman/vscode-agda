  module Test₀ where
--
    data Nat : Set₀ where
      zero : Nat
      succ : Nat → Nat
  --
      con : Nat
--
       → {- text -} okay {- text -}
{- text -} → okay
       → okay
      → nope

    invalid

    module Inner where
      data T : Set where
        c : T
      d : T
      record S : Set where
      no-eta-equality

      record Alg : Set₁ where
        no-eta-equality
        inductive
        field
          car : Set₀
          _*_ : car → car → car

 -- outside module
 data Nope : Set where

record Nope : Set where

module Test₁ where
  module Test₂ where
