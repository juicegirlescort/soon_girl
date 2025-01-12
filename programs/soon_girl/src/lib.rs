use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Token, TokenAccount, Transfer};

declare_id!("HUH9DHb74FLi7Gqo82WnVwZ8QXEYXNETidngX8zGrZAf");

#[program]
pub mod ai_chat_payment {
    use super::*;

    pub fn process_chat_payment(ctx: Context<ProcessPayment>) -> Result<()> {
        let program_authority_bump = ctx.bumps.program_authority;
        let authority_seeds = &[b"authority".as_ref(), &[program_authority_bump]];

        // Fixed amount of 10 tokens
        let amount = 10;
        let burn_amount = 5;
        let treasury_amount = 5;

        // Transfer tokens from user to program PDA
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_account.to_account_info(),
                    to: ctx.accounts.program_token_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        // Burn 50% of the tokens
        token::burn(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    from: ctx.accounts.program_token_account.to_account_info(),
                    authority: ctx.accounts.program_authority.to_account_info(),
                },
                &[authority_seeds],
            ),
            burn_amount,
        )?;

        // Transfer 50% of the tokens to the treasury
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.program_token_account.to_account_info(),
                    to: ctx.accounts.treasury_account.to_account_info(),
                    authority: ctx.accounts.program_authority.to_account_info(),
                },
                &[authority_seeds],
            ),
            treasury_amount,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == token_mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_mint: Account<'info, token::Mint>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"program_token", token_mint.key().as_ref()],
        bump,
        token::mint = token_mint,
        token::authority = program_authority,
    )]
    pub program_token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"authority"],
        bump,
    )]
    /// CHECK: PDA used as authority
    pub program_authority: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = user,
        address = Pubkey::new_from_array([76, 60, 24, 27, 26, 104, 22, 123, 246, 52, 214, 198, 10, 246, 175, 59, 226, 42, 241, 107, 240, 38, 153, 151, 192, 31, 225, 231, 201, 8, 121, 47]),
        token::mint = token_mint,
        token::authority = program_authority,
    )]
    pub treasury_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
