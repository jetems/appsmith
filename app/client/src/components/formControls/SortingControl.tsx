import React, { useEffect } from "react";
import FormControl from "pages/Editor/FormControl";
import Icon, { IconSize } from "components/ads/Icon";
import styled, { css } from "styled-components";
import { FieldArray } from "redux-form";
import FormLabel from "components/editorComponents/FormLabel";
import { ControlProps } from "./BaseControl";
import { Colors } from "constants/Colors";

// Form config for the condition field
const columnFieldConfig: any = {
  key: "column",
  controlType: "DROP_DOWN",
  initialValue: "",
  options: [],
  placeholderText: "Select Column",
};

// Form config for the condition field
const orderFieldConfig: any = {
  key: "order",
  controlType: "DROP_DOWN",
  initialValue: "Ascending",
  options: [
    {
      label: "Ascending",
      value: "Ascending",
    },
    {
      label: "Descending",
      value: "Descending",
    },
  ],
};

// // Form config for the operator field
// const logicalFieldConfig: any = {
//   label: "Condition",
//   key: "condition",
//   controlType: "DROP_DOWN",
//   initialValue: "EQ",
//   options: [],
//   customStyles: { width: "10vh", height: "30px" },
// };

const SortingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: min-content;
  justify-content: space-between;
`;

const SortingDropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: min-content;
  justify-content: space-between;
`;

const ColumnDropdownContainer = styled.div`
  width: 30vw;
  margin-right: 1rem;
`;

const OrderDropdownContainer = styled.div`
  width: 15vw;
`;

// Component for the icons
const CenteredIcon = styled(Icon)<{ noMarginLeft?: boolean }>`
  margin-left: 10px;
  align-self: end;
  margin-bottom: 10px;
  &.hide {
    opacity: 0;
    pointer-events: none;
  }
  color: ${Colors.GREY_7};

  ${(props) =>
    props.noMarginLeft &&
    css`
      margin-left: 0px;
    `}
`;

const StyledBottomLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${Colors.GREY_7};
  cursor: pointer;
`;

export const StyledBottomLabel = styled(FormLabel)`
  margin-top: 5px;
  margin-left: 5px;
  font-weight: 400;
  font-size: 12px;
  color: ${Colors.GREY_7};
  line-height: 16px;
`;

function SortingComponent(props: any) {
  const customStyles = {
    width: `100%`,
    height: "30px",
  };

  // eslint-disable-next-line no-console
  console.log(props, "hereeeeeeee");

  const onDeletePressed = (index: number) => {
    props.fields.remove(index);
  };

  useEffect(() => {
    if (props.fields.length < 1) {
      props.fields.push({
        column: "",
        order: "Ascending",
      });
    } else {
      onDeletePressed(props.index);
    }
  }, [props.fields.length]);

  return (
    <SortingContainer>
      {props.fields &&
        props.fields.length > 0 &&
        props.fields.map((field: any, index: number) => (
          <SortingDropdownContainer key={index}>
            <ColumnDropdownContainer>
              <FormControl
                config={{
                  ...columnFieldConfig,
                  label: "",
                  customStyles,
                  configProperty: `${field}.column`,
                  options: props.options,
                  // initialValue: props.comparisonTypes[0].value,
                }}
                formName={props.formName}
              />
            </ColumnDropdownContainer>
            <OrderDropdownContainer>
              <FormControl
                config={{
                  ...orderFieldConfig,
                  label: "",
                  customStyles,
                  configProperty: `${field}.order`,
                }}
                formName={props.formName}
              />
            </OrderDropdownContainer>
            {/* Component to render the delete icon */}
            {index !== 0 && (
              <CenteredIcon
                name="cross"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDeletePressed(index);
                }}
                size={IconSize.SMALL}
              />
            )}
          </SortingDropdownContainer>
        ))}

      <StyledBottomLabelContainer
        onClick={() =>
          props.fields.push({
            column: "",
            order: "Ascending",
          })
        }
      >
        <CenteredIcon name="add-more-fill" noMarginLeft size={IconSize.SMALL} />
        <StyledBottomLabel>Add Another sort Parameter</StyledBottomLabel>
      </StyledBottomLabelContainer>
    </SortingContainer>
  );
}

export default function SortingControl(props: SortingControlProps) {
  const {
    configProperty, // JSON path for the where clause data
    formName, // Name of the form, used by redux-form lib to store the data in redux store
    options, // set of options for column property.
  } = props;

  return (
    <FieldArray
      component={SortingComponent}
      key={`${configProperty}`}
      name={`${configProperty}`}
      props={{
        configProperty,
        formName,
        options,
      }}
      rerenderOnEveryChange={false}
    />
  );
}

export type SortingControlProps = ControlProps;