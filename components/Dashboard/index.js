import useAccount from "@components/hooks/useAccount";
import BoxIcon from "@components/icons/BoxIcon";
import Icon from "@components/icons/Icon";
import PlusIcon from "@components/icons/PlusIcon";
import Masonry from "@components/Masonry";
import FormModal from "@components/Modal/FormModal";
import React, { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

function LoadingDial() {
  return (
    <div className="text-center">
      <div
        className="radial-progress animate-spin"
        style={{
          "--value": 20,
        }}
      ></div>
    </div>
  );
}

export default function Dashboard({
  id,
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

  useEffect(() => {
    if (account && account.id) {
      queryClient.invalidateQueries(id);
    }
  }, [account, queryClient, id]);

  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent place-items-start">
        <div className={`hero-content block mx-auto my-20 w-full`}>
          {!isAccountLoading ? (
            <>
              <div className="card card-compact bg-base-100 shadow-xl mb-4">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="card-title">
                      {typeof name === "function"
                        ? name(account)
                        : name ?? "Dashboard"}
                    </h2>
                    <div className="card-actions justify-end">
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
                    </div>
                  </div>
                </div>
              </div>
              {isDataLoading ? (
                <LoadingDial />
              ) : data.length > 0 ? (
                <>
                  <div className="hidden">
                    <div className="flex sm:flex lg:flex xl:flex"></div>
                    <div className="hidden sm:hidden lg:hidden xl:hidden"></div>
                  </div>
                  <Masonry>
                    {data.map((d, index) =>
                      React.cloneElement(dataComponent, {
                        key: d.id,
                        data: { ...d, index: index + 1 },
                        onDelete: () => {
                          queryClient.setQueryData(id, (oldData) =>
                            oldData.filter((p) => p.id !== d.id)
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
            </>
          ) : (
            <LoadingDial />
          )}
        </div>
      </div>
    </div>
  );
}
