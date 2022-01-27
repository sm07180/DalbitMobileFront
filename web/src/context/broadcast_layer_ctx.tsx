// React
import React, { createContext, useReducer } from "react";

type LayerType = {
  status: boolean;
  type?: string;
  others?: any;
};

type ActionType = {
  type: "INIT" | "GIFT" | "BOOST";
  others?: any;
};

type DimActionType = {
  type: "INIT" | "BROAD_END" | "DIRECT_GIFT" | "LEVEL_UP" | "FULL_MOON" | "ROULETTE" | "MOON_LAND";
  others?: any;
};

type BundleType = {
  layer: LayerType;
  dispatchLayer(action: ActionType): void;
  dimLayer: LayerType;
  dispatchDimLayer(action: DimActionType): void;
};

function layerReducer(state: LayerType, action: ActionType): LayerType {
  const { type, others } = action;

  switch (type) {
    case "INIT": {
      return {
        status: false,
      };
    }

    default:
      return {
        status: true,
        type,
        others: { ...others },
      };
  }
}

function dimLayerReducer(state: LayerType, action: DimActionType): LayerType {
  const { type, others } = action;

  switch (type) {
    case "INIT": {
      return {
        status: false,
      };
    }

    default:
      return {
        status: true,
        type,
        others: { ...others },
      };
  }
}

const initialData = {
  layer: {
    status: false,
  },
  dimLayer: {
    status: false,
  },

  dispatchLayer: () => {},
  dispatchDimLayer: () => {},
};

const BroadcastLayerContext = createContext<BundleType>(initialData);

function BroadcastLayerProvider(props: { children: JSX.Element }) {
  const [layer, dispatchLayer] = useReducer(layerReducer, initialData.layer);
  const [dimLayer, dispatchDimLayer] = useReducer(dimLayerReducer, initialData.dimLayer);

  const bundle = {
    layer,
    dispatchLayer,
    dimLayer,
    dispatchDimLayer,
  };

  return <BroadcastLayerContext.Provider value={bundle}>{props.children}</BroadcastLayerContext.Provider>;
}

export { BroadcastLayerContext, BroadcastLayerProvider };
