module Example02 where

infix 0 _≤_
infixl 1 _▸_

data Maybe (A : Set) : Set where
  no : Maybe A
  so : (a : A) → Maybe A

_≫=_ : {A B : Set} → Maybe A → (A → Maybe B) → Maybe B
no ≫= f = no
so a ≫= f = f a

data Pol : Set where
  - : Pol
  + : Pol

data Dir : Set where
  ≪ : Dir
  ≫ : Dir

data Sco (d : Dir) : Set where
  [] : Sco d
  _▸_ : (σ : Sco d) (p : Pol) → Sco d

data #Var {d} (p : Pol) : (σ : Sco d) → Set where
  ze : ∀ {σ} → #Var p (σ ▸ p)
  su_ : ∀ {q σ} → #Var p σ → #Var p (σ ▸ q)

Var : ∀ {d} (σ : Sco d) (p : Pol) → Set
Var {d} σ p = #Var {d} p σ
{-# DISPLAY #Var {d} p σ = Var {d} σ p #-}

mutual
  record Cmd (Γ : Sco ≪) (Δ : Sco ≫) : Set where
    no-eta-equality
    inductive
    constructor ⟨_∥_⟩
    field
      {pol} : Pol
      exp : Exp Γ Δ pol
      ctx : Ctx Γ Δ pol

  data Exp (Γ : Sco ≪) (Δ : Sco ≫) : Pol → Set where
    var : (x⁻ : Var Γ -) → Exp Γ Δ -
    μ_ : ∀ {p} (c : Cmd Γ (Δ ▸ p)) → Exp Γ Δ p
    μ⟨-⟩_ : ∀ (c : Cmd Γ (Δ ▸ +)) → Exp Γ Δ -
    ⇑_ : (V₊ : Val Γ Δ +) → Exp Γ Δ +

  data Val (Γ : Sco ≪) (Δ : Sco ≫) : Pol → Set where
    var : (x⁺ : Var Γ +) → Val Γ Δ +
    ⟨_⟩ : (v₋ : Exp Γ Δ -) → Val Γ Δ +
    ⇓_ : ∀ {p} (v₋ : Exp Γ Δ p) → Val Γ Δ p

  data Ctx (Γ : Sco ≪) (Δ : Sco ≫) : Pol → Set where
    var : (α⁺ : Var Δ +) → Ctx Γ Δ +
    ν_ : ∀ {p} (c : Cmd (Γ ▸ p) Δ) → Ctx Γ Δ p
    ν⟨-⟩_ : (c : Cmd (Γ ▸ -) Δ) → Ctx Γ Δ +
    ⇑_ : (π : Stk Γ Δ -) → Ctx Γ Δ -

  data Stk (Γ : Sco ≪) (Δ : Sco ≫) : Pol → Set where
    var : (α⁻ : Var Δ -) → Stk Γ Δ -
    ⟨_⟩ : (e₊ : Ctx Γ Δ +) → Stk Γ Δ -
    ⇓_ : (e₊ : Ctx Γ Δ +) → Stk Γ Δ +

data _≤_ {d} : (σ₀ σ₁ : Sco d) → Set where
  ι : ∀ {σ} → σ ≤ σ
  ↑_ : ∀ {p σ₀ σ₁} (ρ : σ₀ ≤ σ₁) → σ₀ ▸ p ≤ σ₁
  ▸_ : ∀ {p σ₀ σ₁} (ρ : σ₀ ≤ σ₁) → σ₀ ▸ p ≤ σ₁ ▸ p
  ⇆ : ∀ {p₀ p₁ σ₀ σ₁} (ρ : σ₀ ≤ σ₁) → σ₀ ▸ p₀ ▸ p₁ ≤ σ₁ ▸ p₁ ▸ p₀

_≥_ : ∀ {d} (σ₁ σ₀ : Sco d) → Set
σ₁ ≥ σ₀ = σ₀ ≤ σ₁
{-# DISPLAY _≤_ {d} σ₀ σ₁ = _≥_ {d} σ₁ σ₀ #-}

≥var : ∀ {p d} {σ₀ σ₁ : Sco d} → σ₀ ≥ σ₁ → (Var σ₀ p → Var σ₁ p)
≥var ι x = x
≥var (↑ ρ) x = su ≥var ρ x
≥var (▸ ρ) ze = ze
≥var (▸ ρ) (su x) = su ≥var ρ x
≥var (⇆ ρ) ze = su ze
≥var (⇆ ρ) (su ze) = ze
≥var (⇆ ρ) (su su x) = su su (≥var ρ x)

instance
  #ι : ∀ {d} {σ : Sco d} → σ ≤ σ
  #ι = ι

  #↑ : ∀ {d p} {σ₀ σ₁ : Sco d} ⦃ ρ : σ₀ ≤ σ₁ ⦄ → σ₀ ▸ p ≤ σ₁
  #↑ ⦃ ρ ⦄ = ↑ ρ

  #▸ : ∀ {d p} {σ₀ σ₁ : Sco d} ⦃ ρ : σ₀ ≤ σ₁ ⦄ → σ₀ ▸ p ≤ σ₁ ▸ p
  #▸ ⦃ ρ ⦄ = ▸ ρ

  #⇆ : ∀ {d p₀ p₁} {σ₀ σ₁ : Sco d} ⦃ ρ : σ₀ ≤ σ₁ ⦄ → σ₀ ▸ p₀ ▸ p₁ ≤ σ₁ ▸ p₁ ▸ p₀
  #⇆ ⦃ ρ ⦄ = ⇆ ρ

mutual
  ≥cmd : ∀ {Γ₀ Γ₁ Δ₀ Δ₁} ⦃ ρ₀ : Γ₀ ≥ Γ₁ ⦄ ⦃ ρ₁ : Δ₀ ≥ Δ₁ ⦄ → (Cmd Γ₀ Δ₀ → Cmd Γ₁ Δ₁)
  ≥cmd ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ ⟨ v ∥ e ⟩ = ⟨ ≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ v ∥ ≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ e ⟩

  ≥exp : ∀ {p Γ₀ Γ₁ Δ₀ Δ₁} ⦃ ρ₀ : Γ₀ ≥ Γ₁ ⦄ ⦃ ρ₁ : Δ₀ ≥ Δ₁ ⦄ → (Exp Γ₀ Δ₀ p → Exp Γ₁ Δ₁ p)
  ≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (var x⁻) = var (≥var ρ₀ x⁻)
  ≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (μ c) = μ ≥cmd ⦃ ρ₀ ⦄ ⦃ ▸ ρ₁ ⦄ c
  ≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (μ⟨-⟩ c) = μ⟨-⟩ ≥cmd ⦃ ρ₀ ⦄ ⦃ ▸ ρ₁ ⦄ c
  ≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (⇑ V₊) = ⇑ (≥val ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ V₊)

  ≥val : ∀ {p Γ₀ Γ₁ Δ₀ Δ₁} ⦃ ρ₀ : Γ₀ ≥ Γ₁ ⦄ ⦃ ρ₁ : Δ₀ ≥ Δ₁ ⦄ → (Val Γ₀ Δ₀ p → Val Γ₁ Δ₁ p)
  ≥val ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (var x⁺) = var (≥var ρ₀ x⁺)
  ≥val ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ ⟨ v₋ ⟩ = ⟨ ≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ v₋ ⟩
  ≥val ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (⇓ v₋) = ⇓ (≥exp ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ v₋)

  ≥ctx : ∀ {p Γ₀ Γ₁ Δ₀ Δ₁} ⦃ ρ₀ : Γ₀ ≥ Γ₁ ⦄ ⦃ ρ₁ : Δ₀ ≥ Δ₁ ⦄ → (Ctx Γ₀ Δ₀ p → Ctx Γ₁ Δ₁ p)
  ≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (var α⁺) = var (≥var ρ₁ α⁺)
  ≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (ν c) = ν ≥cmd ⦃ ▸ ρ₀ ⦄ ⦃ ρ₁ ⦄ c
  ≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (ν⟨-⟩ c) = ν⟨-⟩ ≥cmd ⦃ ▸ ρ₀ ⦄ ⦃ ρ₁ ⦄ c
  ≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (⇑ π) = ⇑ (≥stk ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ π)

  ≥stk : ∀ {p Γ₀ Γ₁ Δ₀ Δ₁} ⦃ ρ₀ : Γ₀ ≥ Γ₁ ⦄ ⦃ ρ₁ : Δ₀ ≥ Δ₁ ⦄ → (Stk Γ₀ Δ₀ p → Stk Γ₁ Δ₁ p)
  ≥stk ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (var α⁻) = var (≥var ρ₁ α⁻)
  ≥stk ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ ⟨ e₊ ⟩ = ⟨ ≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ e₊ ⟩
  ≥stk ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ (⇓ e₊) = ⇓ (≥ctx ⦃ ρ₀ ⦄ ⦃ ρ₁ ⦄ e₊)

{-# TERMINATING #-}
mutual
  cmd/exp : ∀ {Γ Δ} → Cmd (Γ ▸ -) Δ → Exp Γ Δ - → Cmd Γ Δ
  cmd/exp ⟨ v ∥ e ⟩ v′ = ⟨ exp/exp v v′ ∥ ctx/exp e v′ ⟩

  cmd/val : ∀ {Γ Δ} → Cmd (Γ ▸ +) Δ → Val Γ Δ + → Cmd Γ Δ
  cmd/val ⟨ v ∥ e ⟩ V′ = ⟨ exp/val v V′ ∥ ctx/val e V′ ⟩

  cmd/ctx : ∀ {Γ Δ} → Cmd Γ (Δ ▸ +) → Ctx Γ Δ + → Cmd Γ Δ
  cmd/ctx ⟨ v ∥ e ⟩ e′ = ⟨ exp/ctx v e′ ∥ ctx/ctx e e′ ⟩

  cmd/stk : ∀ {Γ Δ} → Cmd Γ (Δ ▸ -) → Stk Γ Δ - → Cmd Γ Δ
  cmd/stk ⟨ v ∥ e ⟩ π′ = ⟨ exp/stk v π′ ∥ ctx/stk e π′ ⟩

  exp/exp : ∀ {p Γ Δ} → Exp (Γ ▸ -) Δ p → Exp Γ Δ - → Exp Γ Δ p
  exp/exp (var ze) v′ = v′
  exp/exp (var (su x⁻)) v′ = var x⁻
  exp/exp (μ c) v′ = μ cmd/exp c (≥exp v′)
  exp/exp (μ⟨-⟩ c) v′ = μ⟨-⟩ cmd/exp c (≥exp v′)
  exp/exp (⇑ V₊) v′ = ⇑ (val/exp V₊ v′)

  exp/val : ∀ {p Γ Δ} → Exp (Γ ▸ +) Δ p → Val Γ Δ + → Exp Γ Δ p
  exp/val (var (su x⁻)) V′ = var x⁻
  exp/val (μ c) V′ = μ cmd/val c (≥val V′)
  exp/val (μ⟨-⟩ c) V′ = μ⟨-⟩ cmd/val c (≥val V′)
  exp/val (⇑ V₊) V′ = ⇑ (val/val V₊ V′)

  exp/ctx : ∀ {p Γ Δ} → Exp Γ (Δ ▸ +) p → Ctx Γ Δ + → Exp Γ Δ p
  exp/ctx (var x⁻) e′ = var x⁻
  exp/ctx (μ c) e′ = μ cmd/ctx (≥cmd c) (≥ctx e′)
  exp/ctx (μ⟨-⟩ c) e′ = μ⟨-⟩ cmd/ctx c (≥ctx e′)
  exp/ctx (⇑ V₊) e′ = ⇑ (val/ctx V₊ e′)

  exp/stk : ∀ {p Γ Δ} → Exp Γ (Δ ▸ -) p → Stk Γ Δ - → Exp Γ Δ p
  exp/stk (var x⁻) π′ = var x⁻
  exp/stk (μ c) π′ = μ cmd/stk (≥cmd c) (≥stk π′)
  exp/stk (μ⟨-⟩ c) π′ = μ⟨-⟩ cmd/stk (≥cmd c) (≥stk π′)
  exp/stk (⇑ V₊) π′ = ⇑ (val/stk V₊ π′)

  val/exp : ∀ {p Γ Δ} → Val (Γ ▸ -) Δ p → Exp Γ Δ - → Val Γ Δ p
  val/exp (var (su x⁺)) v′ = var x⁺
  val/exp ⟨ v₋ ⟩ v′ = ⟨ exp/exp v₋ v′ ⟩
  val/exp (⇓ v₋) v′ = ⇓ (exp/exp v₋ v′)

  val/val : ∀ {p Γ Δ} → Val (Γ ▸ +) Δ p → Val Γ Δ + → Val Γ Δ p
  val/val (var ze) V′ = V′
  val/val (var (su x⁺)) V′ = var x⁺
  val/val ⟨ v₋ ⟩ V′ = ⟨ exp/val v₋ V′ ⟩
  val/val (⇓ v₋) V′ = ⇓ (exp/val v₋ V′)

  val/ctx : ∀ {p Γ Δ} → Val Γ (Δ ▸ +) p → Ctx Γ Δ + → Val Γ Δ p
  val/ctx (var x⁺) e′ = var x⁺
  val/ctx ⟨ v₋ ⟩ e′ = ⟨ exp/ctx v₋ e′ ⟩
  val/ctx (⇓ v₋) e′ = ⇓ (exp/ctx v₋ e′)

  val/stk : ∀ {p Γ Δ} → Val Γ (Δ ▸ -) p → Stk Γ Δ - → Val Γ Δ p
  val/stk (var x⁺) π′ = var x⁺
  val/stk ⟨ v₋ ⟩ π′ = ⟨ exp/stk v₋ π′ ⟩
  val/stk (⇓ v₋) π′ = ⇓ (exp/stk v₋ π′)

  ctx/exp : ∀ {p Γ Δ} → Ctx (Γ ▸ -) Δ p → Exp Γ Δ - → Ctx Γ Δ p
  ctx/exp (var α⁺) v′ = var α⁺
  ctx/exp (ν c) v′ = ν cmd/exp (≥cmd c) (≥exp v′)
  ctx/exp (ν⟨-⟩ c) v′ = ν⟨-⟩ cmd/exp c (≥exp v′)
  ctx/exp (⇑ π) v′ = ⇑ (stk/exp π v′)

  ctx/val : ∀ {p Γ Δ} → Ctx (Γ ▸ +) Δ p → Val Γ Δ + → Ctx Γ Δ p
  ctx/val (var α⁺) V′ = var α⁺
  ctx/val (ν c) V′ = ν cmd/val (≥cmd c) (≥val V′)
  ctx/val (ν⟨-⟩ c) V′ = ν⟨-⟩ cmd/val (≥cmd c) (≥val V′)
  ctx/val (⇑ π) V′ = ⇑ (stk/val π V′)

  ctx/ctx : ∀ {p Γ Δ} → Ctx Γ (Δ ▸ +) p → Ctx Γ Δ + → Ctx Γ Δ p
  ctx/ctx (var ze) e′ = e′
  ctx/ctx (var (su α⁺)) e′ = var α⁺
  ctx/ctx (ν c) e′ = ν cmd/ctx c (≥ctx e′)
  ctx/ctx (ν⟨-⟩ c) e′ = ν⟨-⟩ cmd/ctx c (≥ctx e′)
  ctx/ctx (⇑ π) e′ = ⇑ (stk/ctx π e′)

  ctx/stk : ∀ {p Γ Δ} → Ctx Γ (Δ ▸ -) p → Stk Γ Δ - → Ctx Γ Δ p
  ctx/stk (var (su α⁺)) π′ = var α⁺
  ctx/stk (ν c) π′ = ν cmd/stk c (≥stk π′)
  ctx/stk (ν⟨-⟩ c) π′ = ν⟨-⟩ cmd/stk c (≥stk π′)
  ctx/stk (⇑ π) π′ = ⇑ (stk/stk π π′)

  stk/exp : ∀ {p Γ Δ} → Stk (Γ ▸ -) Δ p → Exp Γ Δ - → Stk Γ Δ p
  stk/exp (var α⁻) v′ = var α⁻
  stk/exp ⟨ e₊ ⟩ v′ = ⟨ ctx/exp e₊ v′ ⟩
  stk/exp (⇓ e₊) v′ = ⇓ (ctx/exp e₊ v′)

  stk/val : ∀ {p Γ Δ} → Stk (Γ ▸ +) Δ p → Val Γ Δ + → Stk Γ Δ p
  stk/val (var α⁻) V = var α⁻
  stk/val ⟨ e₊ ⟩ V = ⟨ ctx/val e₊ V ⟩
  stk/val (⇓ e₊) V = ⇓ (ctx/val e₊ V)

  stk/ctx : ∀ {p Γ Δ} → Stk Γ (Δ ▸ +) p → Ctx Γ Δ + → Stk Γ Δ p
  stk/ctx (var (su α⁻)) e′ = var α⁻
  stk/ctx ⟨ e₊ ⟩ e′ = ⟨ ctx/ctx e₊ e′ ⟩
  stk/ctx (⇓ e₊) e′ = ⇓ (ctx/ctx e₊ e′)

  stk/stk : ∀ {p Γ Δ} → Stk Γ (Δ ▸ -) p → Stk Γ Δ - → Stk Γ Δ p
  stk/stk (var ze) π′ = π′
  stk/stk (var (su α⁻)) π′ = var α⁻
  stk/stk ⟨ e₊ ⟩ π′ = ⟨ ctx/stk e₊ π′ ⟩
  stk/stk (⇓ e₊) π′ = ⇓ (ctx/stk e₊ π′)

--

exp-var : ∀ {p Γ Δ} → Var Γ p → Exp Γ Δ p
exp-var { - } x =   var x
exp-var { + } x = ⇑ var x

ctx-var : ∀ {p Γ Δ} → Var Δ p → Ctx Γ Δ p
ctx-var { - } x = ⇑ var x
ctx-var { + } x =   var x

--

▸R : ∀ {Γ Δ} → Cmd Γ Δ → Maybe (Cmd Γ Δ)
▸R ⟨ μ c ∥ ⇑ π ⟩ = so (cmd/stk c π)
▸R ⟨ ⇑ V₊ ∥ ν c ⟩ = so (cmd/val c V₊)
▸R ⟨ ⇑ ⟨ v₋ ⟩ ∥ ν⟨-⟩ c ⟩ = so (cmd/exp c v₋)
▸R ⟨ μ⟨-⟩ c ∥ ⇑ ⟨ e₊ ⟩ ⟩ = so (cmd/ctx c e₊)
▸R _ = no

{-# TERMINATING #-}
▸R* : ∀ {Γ Δ} → Cmd Γ Δ → Maybe (Cmd Γ Δ)
▸R* c with ▸R c
… | no = so c
… | so c′ = ▸R* c′

--

▸E-μ : ∀ {p Γ Δ} → Exp Γ Δ p → Exp Γ Δ p
▸E-μ v = μ ⟨ ≥exp v ∥ ctx-var ze ⟩

▸E-ν : ∀ {p Γ Δ} → Ctx Γ Δ p → Ctx Γ Δ p
▸E-ν e = ν ⟨ exp-var ze ∥ ≥ctx e ⟩

▸E-ν⟨-⟩ : ∀ {Γ Δ} → Ctx Γ Δ + → Ctx Γ Δ +
▸E-ν⟨-⟩ e₊ = ν⟨-⟩ ⟨ ⇑ ⟨ var ze ⟩ ∥ ≥ctx e₊ ⟩

▸E-μ⟨-⟩ : ∀ {Γ Δ} → Exp Γ Δ - → Exp Γ Δ -
▸E-μ⟨-⟩ v₋ = μ⟨-⟩ ⟨ ≥exp v₋ ∥ ⇑ ⟨ var ze ⟩ ⟩

--

let# : ∀ {p Γ Δ} → Exp Γ Δ + → Exp (Γ ▸ -) Δ p → Exp Γ Δ p
let# v₀₊ v₁ = μ ⟨ ≥exp v₀₊ ∥ ν⟨-⟩ ⟨ ≥exp ⦃ ρ₀ = ι ⦄ v₁ ∥ ctx-var ze ⟩ ⟩

--

delay : ∀ {Γ Δ} → Val Γ Δ + → Exp Γ Δ -
delay V₊ = μ⟨-⟩ ⟨ ≥exp (⇑ V₊) ∥ var ze ⟩

force : ∀ {Γ Δ} → Exp Γ Δ - → Val Γ Δ +
force v₋ = ⇓ (μ ⟨ ≥exp v₋ ∥ ⇑ ⟨ var ze ⟩ ⟩)

--

into : ∀ {Γ Δ} → Exp Γ Δ - → Val Γ Δ +
into v₋ = ⟨ v₋ ⟩

from : ∀ {Γ Δ} → Val Γ Δ + → Exp Γ Δ -
from V₊ = let# (⇑ V₊) (var ze)
