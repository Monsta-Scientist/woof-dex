import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import FloatingElement from './layout/FloatingElement';
import styled from 'styled-components';
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
  useTokenAccounts,
} from '../utils/markets';
import DepositDialog from './DepositDialog';
import { useWallet } from '../utils/wallet';
import { settleFunds } from '../utils/send';
import { useSendConnection } from '../utils/connection';
import { notify } from '../utils/notifications';
import { Balances } from '../utils/types';
import StandaloneTokenAccountsSelect from './StandaloneTokenAccountSelect';
import logo1 from '../assets/logo1.svg';

const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const ActionButton = styled(Button)`
  color: '#FCD34D';
  opacity: .75;
  font-size: 12px;
  display: 'inline-block';
  padding-right: 15px;
  padding-left: 15px;
  border-radius: 4px;
  border: 1px solid #FCD34D, 0.5);
`;

export default function StandaloneBalancesDisplay() {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const balances = useBalances();
  const openOrdersAccount = useSelectedOpenOrdersAccount(true);
  const connection = useSendConnection();
  const { wallet, connected } = useWallet();
  const [baseOrQuote, setBaseOrQuote] = useState('');
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount();
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount();
  const [tokenAccounts] = useTokenAccounts();
  const baseCurrencyBalances = 
    balances && balances.find((b) => b.coin === baseCurrency);
  const quoteCurrencyBalances = 
    balances && balances.find((b) => b.coin === quoteCurrency);

  async function onSettleFunds() {
    if (!wallet) {
      notify({
        message: 'Wallet not connected',
        description: 'wallet is undefined',
        type: 'error',
      });
      return;
    }

    if (!market) {
      notify({
        message: 'Error settling funds',
        description: 'market is undefined',
        type: 'error',
      });
      return;
    }
    if (!openOrdersAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }
    if (!baseCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }
    if (!quoteCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }

    try {
      await settleFunds({
        market,
        openOrders: openOrdersAccount,
        connection,
        wallet,
        baseCurrencyAccount,
        quoteCurrencyAccount,
      });
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
    }
  }

  const formattedBalances: [
    string | undefined,
    Balances | undefined,
    string,
    string | undefined,
  ][] = [
    [
      baseCurrency,
      baseCurrencyBalances,
      'base',
      market?.baseMintAddress.toBase58(),
    ],
    [
      quoteCurrency,
      quoteCurrencyBalances,
      'quote',
      market?.quoteMintAddress.toBase58(),
    ],
  ];
  return (
    <FloatingElement style={{ flex: 1, paddingTop: 9, marginLeft: "25px" }}>
      <div
       style={{
         width: '100%',
         borderBottom: '1px solid #232323',
         fontSize: 14,
         paddingBottom: 12,

       }}
      >
        Wallet Balance
      </div>
      <div style={{ paddingRight: 10}}>
        <Row style={{
          marginTop: 16,
          color: '#FCD34D',
          opacity: .8,
          fontSize: 12,
          textAlign: 'right',
        }}>
          <Col span={6} style={{ textAlign: 'left' }}>
            Asset
          </Col>
          <Col span={9}>
            Wallet balance
          </Col>
          <Col span={9}>
            Unsettled balance
          </Col>
        </Row>
        {formattedBalances.map(
          ([currency, balances, baseOrQuote, mint], index) => (
            <React.Fragment key={index}>
              <Row style={{
                marginTop: 16,
                fontSize: 12,
                color: '#FCD34D',
                textAlign: 'right',
                borderBottom: '1px solid #232323',
                paddingBottom: 18,
              }}>
                <Col span={6} style={{ color: '#FCD34D', opacity: .6, textAlign: 'left' }}>
                  {currency}
                </Col>
                <Col span={9}>
                  {balances && balances.wallet}
                </Col>
                <Col span={9}>
                  {balances && balances.unsettled}
                </Col>
                <Col span={6} style={{ paddingTop: 8}}>
                </Col>
                <Col span={9} style={{ paddingTop: 8}}>
                  {/* <ActionButton
                    size="small"
                    onClick={() => setBaseOrQuote(baseOrQuote)}
                  >
                    Deposit
                  </ActionButton> */}
                </Col>
                <Col span={9} style={{ paddingTop: 8}}>
                  <ActionButton size="small" onClick={onSettleFunds}>
                    Settle
                  </ActionButton>
                </Col>
              </Row>

              {connected && (
                <RowBox align="middle" style={{ paddingBottom: 10 }}>
                  <StandaloneTokenAccountsSelect
                    accounts={tokenAccounts?.filter(
                      (account) => account.effectiveMint.toBase58() === mint,
                    ).sort((a, b) => a.pubkey.toString() === wallet?.publicKey.toString() ? -1 : 1)}
                    mint={mint}
                    label
                  />
                </RowBox>
              )}
            </React.Fragment>
          ),
        )}
      </div>
      <DepositDialog
        baseOrQuote={baseOrQuote}
        onClose={() => setBaseOrQuote('')}
      />
      <div style={{ textAlign: 'center', paddingTop: 32 }}>
        <img src={logo1} alt="" style={{ width: 80, opacity: 0.7, marginTop: "auto"}}/>
        <div style={{ paddingTop: 20, fontSize: 16, color: '#F1F1F2' }}>
          First time trading
        </div>
        <div style={{ fontSize: 16, color: '#F1F1F2' }}>
          on Solana?
        </div>
        <a
          href={'https://twitter.com/monstascientist/'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color : 'rgb(173,175,184)',}}
        >
        <div style={{ paddingTop: 16, fontSize: 12, color: '#FCD34D', opacity: 0.8}}>
            Learn more about MONSTA here.
        </div>
      </a>
      </div>
    </FloatingElement>
  );
}
