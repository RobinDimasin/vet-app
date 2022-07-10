import useAccount from "@components/hooks/useAccount";
import BoxIcon from "@components/icons/BoxIcon";
import Icon from "@components/icons/Icon";
import PlusIcon from "@components/icons/PlusIcon";
import Masonry from "@components/Masonry";
import FormModal from "@components/Modal/FormModal";
import React, { useCallback, useEffect } from "react";
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
}) {
  const queryClient = useQueryClient();

  const { account, loading: isAccountLoading } = useAccount({
    type: accountType,
  });

  const { data, isLoading: isDataLoading } = useQuery(
    account && id,
    async () => await getData(account)
  );

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
                    queryClient.setQueryData(id, (oldData) => [
                      newData,
                      ...oldData,
                    ]);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {isDataLoading ? (
        <>
          <LoadingDial />
        </>
      ) : (data ?? []).length > 0 ? (
        <>
          <div className="hidden">
            <div className="flex sm:flex lg:flex xl:flex"></div>
            <div className="hidden sm:hidden lg:hidden xl:hidden"></div>
          </div>
          <Masonry>
            {data.map((d, index) =>
              React.cloneElement(dataComponent, {
                key: keyFunc(d),
                data: { ...d, index: index + 1 },
                onDelete: () => {
                  queryClient.setQueryData(id, (oldData) =>
                    oldData.filter((p) => keyFunc(p) !== keyFunc(d))
                  );
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
