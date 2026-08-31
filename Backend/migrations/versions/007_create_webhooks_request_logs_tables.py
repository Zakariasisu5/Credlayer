"""create webhooks and request_logs tables

Revision ID: 007_webhooks_logs
Revises: 006_api_keys
Create Date: 2025-01-XX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '007_webhooks_logs'
down_revision: Union[str, None] = '006_api_keys'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Webhooks table
    op.create_table(
        'webhooks',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('owner_wallet', sa.String(length=64), nullable=False, index=True),
        sa.Column('url', sa.String(length=512), nullable=False),
        sa.Column('event_types', postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('secret', sa.String(length=128), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_webhooks'))
    )
    op.create_index(op.f('ix_owner_wallet_webhooks'), 'webhooks', ['owner_wallet'], unique=False)
    
    # Request logs table
    op.create_table(
        'request_logs',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('api_key_id', sa.UUID(), nullable=True, index=True),
        sa.Column('owner_wallet', sa.String(length=64), nullable=False, index=True),
        sa.Column('method', sa.String(length=16), nullable=False),
        sa.Column('endpoint', sa.String(length=512), nullable=False),
        sa.Column('status_code', sa.Integer(), nullable=False),
        sa.Column('request_headers', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('request_body', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('response_body', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('duration_ms', sa.Integer(), nullable=True),
        sa.Column('ip_address', sa.String(length=64), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_request_logs'))
    )
    op.create_index(op.f('ix_api_key_id_logs'), 'request_logs', ['api_key_id'], unique=False)
    op.create_index(op.f('ix_owner_wallet_logs'), 'request_logs', ['owner_wallet'], unique=False)
    op.create_index(op.f('ix_created_at_logs'), 'request_logs', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_created_at_logs'), table_name='request_logs')
    op.drop_index(op.f('ix_owner_wallet_logs'), table_name='request_logs')
    op.drop_index(op.f('ix_api_key_id_logs'), table_name='request_logs')
    op.drop_table('request_logs')
    
    op.drop_index(op.f('ix_owner_wallet_webhooks'), table_name='webhooks')
    op.drop_table('webhooks')
