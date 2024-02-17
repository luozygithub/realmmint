import styled from 'styled-components/macro';

export const Subline = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  color: ${p => p.theme.textSecondary};
  margin: 0 0 1.5rem 0;
  text-align: center;
  strong {
    color: ${p => p.theme.text};
  }
`;
