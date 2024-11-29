import React, { useState } from "react";
import { Bike } from "../../data/redux/reducers/bikeReducer";
import { Building } from "../../data/redux/reducers/buildingReducer";
import { Road } from "../../data/redux/reducers/roadReducer";
import TextField from "../general/Textfield";
import { ElementType } from "../../constants/element";
import { useSelector } from "react-redux";
import { RootState, } from "../../data/redux/store/reduxStore";
import { calculateDistance } from "../../services/orderHandler";


interface ElementProps {
  building?: Building;
  bike?: Bike;
  road?: Road;
}

const BuildingElement: React.FC<ElementProps> = ({ building }) => {
  if (!building) return <></>;

  return (
    <>
      <h3 className="font-bold">{building.info}</h3>
      {/* Position */}
      <div className="flex flex-col space-y-10 pt-4 w-[100%]">
        <span> Position </span>

        <div className="flex flex-row justify-between space-x-4 mr-4">
          <TextField
            icon={<span>X</span>}
            width="30%"
            placeholder={building.position[0].toString()}
          />
          <TextField
            icon={<span>Y</span>}
            width="30%"
            placeholder={building.position[1].toString()}
          />
          <TextField
            icon={<span>Z</span>}
            width="30%"
            placeholder={building.position[2].toString()}
          />
        </div>
      </div>

      {/* Size */}
      <div className="flex flex-col space-y-10 pt-4 w-[100%]">
        <span> Size </span>

        <div className="flex flex-row justify-between space-x-4 mr-4">
          <TextField
            icon={<span>Height</span>}
            width="50%"
            placeholder={Math.abs(building.size[1]).toString()}
          />
          <TextField
            icon={<span>Width</span>}
            width="50%"
            placeholder={Math.abs(building.size[0]).toString()}
          />
        </div>
      </div>
    </>
  );
};

const BikeElement: React.FC<ElementProps> = ({ bike }) => {
  if (!bike) return <></>;

  return (
    <>
      <h3 className="font-bold">{bike.info}</h3>
      {/* Position */}
      <div className="flex flex-col space-y-10 pt-4 w-[100%]">
        <span> Position </span>

        <div className="flex flex-row justify-between space-x-4 mr-4">
          <TextField
            icon={<span>X</span>}
            width="30%"
            placeholder={bike.position[0].toFixed(2)}
          />
          <TextField
            icon={<span>Y</span>}
            width="30%"
            placeholder={bike.position[1].toFixed(2)}
          />
          <TextField
            icon={<span>Z</span>}
            width="30%"
            placeholder={bike.position[2].toFixed(2)}
          />
        </div>
      </div>
    </>
  );
};

const RoadElement: React.FC<ElementProps> = ({ road }) => {
  if (!road) return <></>;

  return (
    <>
      <h3 className="font-bold">{road.info}</h3>
      {/* Starts from */}
      <div className="flex flex-col space-y-10 pt-4 w-[100%]">
        <span> Starts from </span>

        <div className="flex flex-row justify-between space-x-4 mr-4">
          <TextField
            icon={<span>X</span>}
            width="30%"
            placeholder={road.start[0].toString()}
          />
          <TextField
            icon={<span>Y</span>}
            width="30%"
            placeholder={road.start[1].toString()}
          />
          <TextField
            icon={<span>Z</span>}
            width="30%"
            placeholder={road.start[2].toString()}
          />
        </div>
      </div>

      {/* Ends at */}
      <div className="flex flex-col space-y-10 pt-4 w-[100%]">
        <span> Ends at </span>

        <div className="flex flex-row justify-between space-x-4 mr-4">
          <TextField
            icon={<span>X</span>}
            width="30%"
            placeholder={road.end[0].toString()}
          />
          <TextField
            icon={<span>Y</span>}
            width="30%"
            placeholder={road.end[1].toString()}
          />
          <TextField
            icon={<span>Z</span>}
            width="30%"
            placeholder={road.end[2].toString()}
          />
        </div>
      </div>

      {/* Size */}
      <div className="flex flex-col space-y-10 pt-4 w-[100%]">
        <span> Size </span>

        <div className="flex flex-row justify-between space-x-4 mr-4">
          <TextField
            icon={<span>Distance</span>}
            width="50%"
            placeholder={Math.abs(
              calculateDistance(road.start, road.end)
            ).toFixed(2)}
          />
          <TextField
            icon={<span>Width</span>}
            width="50%"
            placeholder={road.width.toString()}
          />
        </div>
      </div>
    </>
  );
};

const SidePanel: React.FC = () => {
  const buildings = useSelector(
    (state: RootState) => state.buildings.list as Building[]
  );

  const roads = useSelector((state: RootState) => state.roads.list as Road[]);

  const bikes = useSelector((state: RootState) => state.bikes.list as Bike[]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories = [ElementType.Bike, ElementType.Building, ElementType.Road];

  const toggleDropdown = (category: string) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  return (
    <div className="w-[20vw] bg-gray-100 p-4 fixed right-4 top-4 bottom-4 rounded-2xl h-[95vh] overflow-y-auto overflow-x-hidden">
      {categories.map((category) => (
        <div key={category} className="mb-4">
          <button
            onClick={() => toggleDropdown(category)}
            className="w-full text-left bg-gray-200 p-2 rounded"
          >
            {category}
          </button>
          {openDropdown === category && (
            <div className="mt-2">
              {category === ElementType.Bike && bikes.length > 0 && (
                <>
                  {bikes.map((b, index) => {
                    return (
                      <div
                        key={index}
                        className="p-2 bg-white rounded mb-2 w-full"
                      >
                        <BikeElement bike={b} />
                      </div>
                    );
                  })}
                </>
              )}

              {category === ElementType.Building && buildings.length > 0 && (
                <>
                  {buildings.map((b, index) => {
                    return (
                      <div
                        key={index}
                        className="p-2 bg-white rounded mb-2 w-full"
                      >
                        <BuildingElement building={b} />
                      </div>
                    );
                  })}
                </>
              )}

              {category === ElementType.Road && roads.length > 0 && (
                <>
                  {roads.map((b, index) => {
                    return (
                      <div
                        key={index}
                        className="p-2 bg-white rounded mb-2 w-full"
                      >
                        <RoadElement road={b} />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidePanel;
