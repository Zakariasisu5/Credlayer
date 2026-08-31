"""create connections table

Revision ID: 002_connections
Revises: 001_credentials
Create Date: 2025-01-XX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_connections'
down_revision: Union[str, None] = '001_credentials'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'connections',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('from_wallet', sa.String(length=64), nullable=False, index=True),
        sa.Column('to_wallet', sa.String(length=64), nullable=False, index=True),
        sa.Column('connection_type', sa.String(length=32), nullable=False),
        sa.Column('trust_weight', sa.Float(), nullable=False, server_default='0.5'),
        sa.Column('status', sa.String(length=32), nullable=False, server_default='active'),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_connections'))
    )
    op.create_index(op.f('ix_from_wallet'), 'connections', ['from_wallet'], unique=False)
    op.create_index(op.f('ix_to_wallet'), 'connections', ['to_wallet'], unique=False)
    op.create_index(op.f('ix_connection_pair'), 'connections', ['from_wallet', 'to_wallet'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_connection_pair'), table_name='connections')
    op.drop_index(op.f('ix_to_wallet'), table_name='connections')
    op.drop_index(op.f('ix_from_wallet'), table_name='connections')
    op.drop_table('connections')
