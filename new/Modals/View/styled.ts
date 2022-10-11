import { motion } from 'framer-motion'
import styled from 'styled-components'

export const StyledModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: rgba(15, 22, 36, 0.1);
  backdrop-filter: blur(15px);

  @media screen and (min-width: 1000px) {
    justify-content: center;
  }
`

export const StyledModalContainer = styled(motion.aside)`
  width: 100%;

  @media screen and (min-width: 1000px) {
    max-width: 400px;
    padding: 0;
  }
`

export const StyledModalContent = styled.div`
  position: relative;
  flex-grow: 1;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
  color: black;
  background-color: white;
  border-radius: 16px 16px 0 0;

  header {
    margin-bottom: 20px;
    text-align: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media screen and (min-width: 1000px) {
    padding: 36px 30px 40px;
    border-radius: 8px;
  }
`
