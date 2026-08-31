"""create credentials table

Revision ID: 001_credentials
Revises: 
Create Date: 2025-01-XX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_credentials'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'credentials',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('wallet_address', sa.String(length=64), nullable=False, index=True),
        sa.Column('credential_type', sa.String(length=64), nullable=False),
        sa.Column('credential_value', sa.Text(), nullable=False),
        sa.Column('verification_status', sa.String(length=32), nullable=False, server_default='pending'),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_credentials'))
    )
    op.create_index(op.f('ix_wallet_address'), 'credentials', ['wallet_address'], unique=False)
    op.create_index(op.f('ix_verification_status'), 'credentials', ['verification_status'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_verification_status'), table_name='credentials')
    op.drop_index(op.f('ix_wallet_address'), table_name='credentials')
    op.drop_table('credentials')
