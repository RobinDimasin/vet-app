import useAccount from "@components/hooks/useAccount";
import BoxIcon from "@components/icons/BoxIcon";
import Icon from "@components/icons/Icon";
import PlusIcon from "@components/icons/PlusIcon";
import Masonry from "@components/Masonry";
import FormModal from "@components/Modal/FormModal";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { LoadingDial } from "utility";

export default function Dashboard({
  id,
  keyFunc = (item) => item.id,
  name = (account) => null,
  accountType,
  getData = async (account) => [],
  dataComponent,
  newRecordForm,
  newRecordButtonLabel = null,
  noRecordLabel = "No records found",
  defaultCategory = "data",
}) {
  const queryClient = useQueryClient();

  const { account, loading: isAccountLoading } = useAccount({
    type: accountType,
  });

  const [selectedCatergory, setSelectedCategory] = useState();

  const { data: rawData = {}, isLoading: isDataLoading } = useQuery(
    account && id,
    async () => {
      const data = await getData(account);

      if (Array.isArray(data)) {
        return {
          [defaultCategory]: data,
        };
      }

      return data;
    }
  );

  const categories = useMemo(() => {
    const keys = Object.keys(rawData);

    if (keys.length >= 1) {
      if (defaultCategory in keys) {
        setSelectedCategory(defaultCategory);
      } else {
        setSelectedCategory(keys[0]);
      }
    }

    return keys;
  }, [rawData, defaultCategory]);

  const selectedData = useMemo(() => {
    if (categories.length === 0) {
      return [];
    }

    if (!categories.includes(selectedCatergory)) {
      return rawData[categories[0]];
    }

    return rawData[selectedCatergory];
  }, [rawData, selectedCatergory, categories]);

  return !isAccountLoading ? (
    <div className="px-[10%]">
      <div className="card card-compact bg-base-100 shadow-xl mb-4">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">
              {typeof name === "function" ? name(account) : name ?? "Dashboard"}
            </h2>
            <div className="card-actions justify-end">
              {newRecordForm ? (
                <FormModal
                  trigger={
                    <button className="btn btn-primary">
                      <Icon icon={<PlusIcon />} />
                      <p className="hidden md:block">
                        {newRecordButtonLabel
                          ? newRecordButtonLabel
                          : `New ${name}`}
                      </p>
                      <p className="block md:hidden">New</p>
                    </button>
                  }
                  form={React.cloneElement(newRecordForm)}
                  onSuccess={(newData) => {
                    queryClient.setQueryData(id, (oldData) => {
                      return {
                        ...oldData,
                        [category]: [newData, ...oldData[category]],
                      };
                    });
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {categories.length > 1 ? (
        <div className="card card-compact bg-base-100 shadow-xl mb-4">
          <div className="card-body block !p-2 space-x-2">
            {categories.map((category) => {
              return (
                <button
                  className={`btn btn-xs btn-ghost ${
                    category === selectedCatergory ? "btn-active" : ""
                  }`}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {isDataLoading ? (
        <>
          <LoadingDial />
        </>
      ) : selectedData.length > 0 ? (
        <>
          <div className="hidden">
            <div className="flex sm:flex lg:flex xl:flex"></div>
            <div className="hidden sm:hidden lg:hidden xl:hidden"></div>
          </div>
          <Masonry>
            {selectedData.map((d, index) =>
              React.cloneElement(dataComponent, {
                key: keyFunc(d),
                data: { ...d, index: index + 1 },
                onDelete: () => {
                  queryClient.setQueryData(id, (oldData) => {
                    const newData = {};

                    for (const category of categories) {
                      newData[category] = oldData[category].filter(
                        (item) => keyFunc(item) !== keyFunc(d)
                      );
                    }

                    return newData;
                  });
                },
              })
            )}
          </Masonry>
        </>
      ) : (
        <div className="card card-compact bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <div className="mx-auto">
              <Icon height={12} width={12} icon={<BoxIcon />} />
            </div>
            <p className="mx-auto">{noRecordLabel}</p>
          </div>
        </div>
      )}
    </div>
  ) : (
    <LoadingDial />
  );
}
