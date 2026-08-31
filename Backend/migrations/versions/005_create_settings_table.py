"""create settings table

Revision ID: 005_settings
Revises: 004_activity
Create Date: 2025-01-XX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '005_settings'
down_revision: Union[str, None] = '004_activity'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'settings',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('wallet_address', sa.String(length=64), nullable=False, unique=True, index=True),
        sa.Column('preferences', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('notifications', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('privacy', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_settings'))
    )
    op.create_index(op.f('ix_wallet_address_settings'), 'settings', ['wallet_address'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_wallet_address_settings'), table_name='settings')
    op.drop_table('settings')
