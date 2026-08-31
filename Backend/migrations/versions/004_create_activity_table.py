"""create activity table

Revision ID: 004_activity
Revises: 003_agents
Create Date: 2025-01-XX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '004_activity'
down_revision: Union[str, None] = '003_agents'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'activity',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('wallet_address', sa.String(length=64), nullable=False, index=True),
        sa.Column('event_type', sa.String(length=64), nullable=False),
        sa.Column('event_category', sa.String(length=32), nullable=False),
        sa.Column('title', sa.String(length=256), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('error_details', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_activity'))
    )
    op.create_index(op.f('ix_wallet_address_activity'), 'activity', ['wallet_address'], unique=False)
    op.create_index(op.f('ix_event_type'), 'activity', ['event_type'], unique=False)
    op.create_index(op.f('ix_created_at_activity'), 'activity', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_created_at_activity'), table_name='activity')
    op.drop_index(op.f('ix_event_type'), table_name='activity')
    op.drop_index(op.f('ix_wallet_address_activity'), table_name='activity')
    op.drop_table('activity')
