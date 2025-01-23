import { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Icon from 'components/Icon'

const StyledLink = styled(Link)`
  color: var(--primary-300);
  position: relative;

  &::after {
    vertical-align: super;
    content: '↗';
    font-size: 0.5em;
    font-weight: 800;
  }

  &:hover {
    text-decoration: underline;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
`

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 48px;
  background-color: rgba(0, 0, 0, 0.95);
  border-radius: 16px;
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  gap: 16px;
  display: flex;
  flex-direction: column;

  .closeButton {
    position: absolute;
    top: 40px;
    right: 40px;
    cursor: pointer;

    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
    border-radius: 10%;
    background-color: black;

    &:hover {
      color: rgba(255, 255, 255, 0.6);
      background-color: rgba(255, 255, 255, 0.15);
    }

    &:active {
      color: rgba(255, 255, 255, 0.6);
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
`

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 1rem;
  line-height: 1.8;
`

const ListItem = styled.li`
  display: flex;
  gap: 8px;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`

export default function SunsetModal() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={() => setIsOpen(false)}>
      <ModalContent>
        <button className="closeButton" onClick={() => setIsOpen(false)}>
          <Icon icon="close" $size={24} />
        </button>
        <Text>Dear Adventurers,</Text>

        <Text>
          WNCG Staking will be <strong>sunset by June 30, 2025</strong>.
        </Text>

        <Text>
          Please refer to the{' '}
          <StyledLink
            href="https://bit.ly/WNCGStaking_Sunset"
            target="_blank"
            rel="noopener noreferrer"
          >
            announcement
          </StyledLink>{' '}
          for the details. As you may already know, there are staking platforms
          with higher APR including{' '}
          <StyledLink
            href="https://app.aura.finance/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aura Finance
          </StyledLink>{' '}
          and{' '}
          <StyledLink
            href="https://pancakeswap.finance/liquidity/pools"
            target="_blank"
            rel="noopener noreferrer"
          >
            PancakeSwap
          </StyledLink>
          . For the migration to these platforms, please follow the{' '}
          <StyledLink
            href="https://planetarium.notion.site/Unstaking-and-Migration-Guide-175ed889905f804a99f7c9c066d27936"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unstaking and Migration guide
          </StyledLink>
          .
        </Text>
        <List>
          <ListItem>
            <span>-</span>
            <span>
              Cooldown and withdrawal periods are already updated to allow quick
              unstaking.
            </span>
          </ListItem>
          <ListItem>
            <span>-</span>
            <span>
              <strong>In February 2025</strong>, WNCG APR will be halved.
            </span>
          </ListItem>
          <ListItem>
            <span>-</span>
            <span>
              <strong>In March 2025</strong>, WNCG APR will be 0.
            </span>
          </ListItem>
          <ListItem>
            <span>-</span>
            <span>
              <strong>On June 30, 2025</strong>, this website will be redirected
              to migration guides.
            </span>
          </ListItem>
        </List>
      </ModalContent>
    </ModalOverlay>
  )
}
