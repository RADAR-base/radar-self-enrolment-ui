import {
  Card,
  H2,
  LinkButton,
  typographyH2Styles,
  typographyLinkStyles,
} from "@ory/themes"
import cn from "classnames"
import styled from "styled-components"

const BASE_URL = process.env.BASE_PATH || ""

export const MarginCard = styled(Card)`
  margin-top: 70px;
  margin-bottom: 18px;
  border-radius: 30px;
  background-color: #fff !important;
`
export const InnerCard = styled(Card)`
  margin: 8px 0;
  color: #555;
  text-align: left;
  border-radius: 30px;
  background-color: #f8f9fc !important;
  width: 90%;
  border: none;
`

export const CardTitle = styled(H2)`
  color: #333;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`
export const ActionCard = styled(Card)`
  margin-bottom: 18px;
  background-color: #fff !important;
  border-radius: 20px;
`
export const CenterLink = styled.a`
  ${typographyH2Styles};
  ${typographyLinkStyles};
  text-align: center;
  font-size: 15px;
  color: black !important;
`

export const TextLeftButton = styled(LinkButton)`
  box-sizing: border-box;

  & .linkButton {
    box-sizing: border-box;
    background-color: #706ef4;
    color: #fff;
    font-weight: bold;
  }

  & a {
    &:hover,
    &,
    &:active,
    &:focus,
    &:visited {
      text-align: left;
      background-color: #706ef4 !important;
      color: #fff;
    }
  }
`

export const TextCenterButton = styled(LinkButton)`
  box-sizing: border-box;

  & .linkButton {
    box-sizing: border-box;
    background-color: #706ef4;
    color: #fff;
    font-weight: bold;
    border-radius: 8px !important;
  }

  & a {
    &:hover,
    &,
    &:active,
    &:focus,
    &:visited {
      text-align: center;
      background-color: #706ef4 !important;
      color: #fff;
    }
  }
`

export interface DocsButtonProps {
  title: string
  href?: string
  onClick?: () => void
  testid: string
  disabled?: boolean
  unresponsive?: boolean
}

export const DocsButton = ({
  title,
  href,
  onClick,
  testid,
  disabled,
  unresponsive,
}: DocsButtonProps) => {
  const url = BASE_URL + href
  return (
    <div className={cn("col-xs-4", { "col-md-12": !unresponsive })}>
      <div className="box">
        <TextLeftButton
          onClick={onClick}
          disabled={disabled}
          data-testid={testid}
          href={url}
        >
          {title}
        </TextLeftButton>
      </div>
    </div>
  )
}
