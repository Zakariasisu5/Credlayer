"""create api_keys table

Revision ID: 006_api_keys
Revises: 005_settings
Create Date: 2025-01-XX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '006_api_keys'
down_revision: Union[str, None] = '005_settings'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'api_keys',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('key_hash', sa.String(length=128), nullable=False, unique=True, index=True),
        sa.Column('key_prefix', sa.String(length=16), nullable=False),
        sa.Column('owner_wallet', sa.String(length=64), nullable=False, index=True),
        sa.Column('name', sa.String(length=256), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('permissions', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_api_keys'))
    )
    op.create_index(op.f('ix_key_hash'), 'api_keys', ['key_hash'], unique=True)
    op.create_index(op.f('ix_owner_wallet_api_keys'), 'api_keys', ['owner_wallet'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_owner_wallet_api_keys'), table_name='api_keys')
    op.drop_index(op.f('ix_key_hash'), table_name='api_keys')
    op.drop_table('api_keys')
