import React, {
  useRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import Divider from "components/editorComponents/Divider";
import {
  useWidgets,
  useActions,
  useFilteredDatasources,
  useJSCollections,
} from "./hooks";
import Search from "./ExplorerSearch";
import ExplorerPageGroup from "./Pages/PageGroup";
import { NonIdealState, Classes, IPanelProps } from "@blueprintjs/core";
import WidgetSidebar from "../WidgetSidebar";
import { BUILDER_PAGE_URL } from "constants/routes";
import history from "utils/history";
import JSDependencies from "./JSDependencies";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";
import { useDispatch, useSelector } from "react-redux";
import { getPlugins } from "selectors/entitiesSelector";
import ScrollIndicator from "components/ads/ScrollIndicator";

import { ReactComponent as NoEntityFoundSvg } from "assets/svg/no_entities_found.svg";
import { Colors } from "constants/Colors";

import classNames from "classnames";
import { ReactComponent as PinIcon } from "assets/icons/comments/pin_3.svg";
import { ReactComponent as UnPinIcon } from "assets/icons/comments/unpin.svg";
import { getExplorerPinned } from "selectors/explorerSelector";
import { setExplorerPinned } from "actions/explorerActions";
import { getIsFirstTimeUserOnboardingEnabled } from "selectors/onboardingSelectors";
import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";

import { forceOpenWidgetPanel } from "actions/widgetSidebarActions";
import { getCurrentApplicationId } from "selectors/editorSelectors";

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0px;
    -webkit-appearance: none;
  }
`;

const NoResult = styled(NonIdealState)`
  &.${Classes.NON_IDEAL_STATE} {
    height: auto;
    margin: 20px 0;

    .${Classes.NON_IDEAL_STATE_VISUAL} {
      margin-bottom: 16px;
      height: 52px;

      svg {
        height: 52px;
        width: 144px;
      }
    }

    div {
      color: ${Colors.DOVE_GRAY2};
    }

    .${Classes.HEADING} {
      margin-bottom: 4px;
      color: ${(props) => props.theme.colors.textOnWhiteBG};
    }
  }
`;

const StyledDivider = styled(Divider)`
  border-bottom-color: rgba(255, 255, 255, 0.1);
`;
function EntityExplorer(props: IPanelProps) {
  const dispatch = useDispatch();
  const [searchKeyword, setSearchhKeyword] = useState("");
  const applicationId = useSelector(getCurrentApplicationId);

  const searchInputRef: MutableRefObject<HTMLInputElement | null> = useRef(
    null,
  );
  PerformanceTracker.startTracking(PerformanceTransactionName.ENTITY_EXPLORER);
  useEffect(() => {
    PerformanceTracker.stopTracking();
  });
  const explorerRef = useRef<HTMLDivElement | null>(null);

  const plugins = useSelector(getPlugins);
  const widgets = useWidgets(searchKeyword);
  const actions = useActions(searchKeyword);
  const pinned = useSelector(getExplorerPinned);
  const jsActions = useJSCollections(searchKeyword);
  const datasources = useFilteredDatasources(searchKeyword);
  const isFirstTimeUserOnboardingEnabled = useSelector(
    getIsFirstTimeUserOnboardingEnabled,
  );

  let noResults = false;
  if (searchKeyword) {
    const noWidgets = Object.values(widgets).filter(Boolean).length === 0;
    const noJSActions =
      Object.values(jsActions).filter(
        (jsActions) => jsActions && jsActions.length > 0,
      ).length === 0;
    const noActions =
      Object.values(actions).filter((actions) => actions && actions.length > 0)
        .length === 0;
    const noDatasource =
      Object.values(datasources).filter(
        (datasources) => datasources && datasources.length > 0,
      ).length === 0;
    noResults = noWidgets && noActions && noDatasource && noJSActions;
  }
  const { openPanel } = props;
  const showWidgetsSidebar = useCallback(
    (pageId: string) => {
      history.push(BUILDER_PAGE_URL({ applicationId, pageId }));
      openPanel({ component: WidgetSidebar });
      dispatch(forceOpenWidgetPanel(true));
      if (isFirstTimeUserOnboardingEnabled) {
        dispatch(toggleInOnboardingWidgetSelection(true));
      }
    },
    [openPanel, applicationId, isFirstTimeUserOnboardingEnabled],
  );

  /**
   * toggles the pinned state of sidebar
   */
  const onPin = useCallback(() => {
    dispatch(setExplorerPinned(!pinned));
  }, [pinned, dispatch, setExplorerPinned]);

  /**
   * filter entitites
   */
  const search = (e: any) => {
    setSearchhKeyword(e.target.value);
  };

  const clearSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    setSearchhKeyword("");
  };

  return (
    <Wrapper
      className={classNames({
        "relative space-y-2": true,
      })}
      ref={explorerRef}
    >
      {/* ENTITY EXPLORE HEADER */}
      <div className="sticky top-0 flex items-center justify-between hidden px-3 py-3 z-1">
        <h3 className="text-lg font-semibold text-gray-800 ">Explorer</h3>
        <div className="flex items-center">
          <button
            className="p-1 hover:bg-warmGray-700 group"
            onClick={onPin}
            type="button"
          >
            {pinned ? (
              <PinIcon className="w-4 h-4 text-trueGray-400" />
            ) : (
              <UnPinIcon className="w-4 h-4 text-trueGray-400" />
            )}
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <Search
        clear={clearSearchInput}
        isHidden
        onChange={search}
        ref={searchInputRef}
      />

      <ExplorerPageGroup
        actions={actions}
        datasources={datasources}
        jsActions={jsActions}
        plugins={plugins}
        searchKeyword={searchKeyword}
        showWidgetsSidebar={showWidgetsSidebar}
        step={0}
        widgets={widgets}
      />
      {noResults && (
        <NoResult
          className={Classes.DARK}
          description="Try modifying the search keyword."
          icon={<NoEntityFoundSvg />}
          title="No entities found"
        />
      )}
      <StyledDivider />
      <JSDependencies />
      <ScrollIndicator containerRef={explorerRef} />
    </Wrapper>
  );
}

EntityExplorer.displayName = "EntityExplorer";

export default EntityExplorer;
