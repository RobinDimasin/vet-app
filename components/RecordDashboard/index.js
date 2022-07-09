import useAccount from "@components/hooks/useAccount";
import BoxIcon from "@components/icons/BoxIcon";
import Icon from "@components/icons/Icon";
import PlusIcon from "@components/icons/PlusIcon";
import Masonry from "@components/Masonry";
import FormModal from "@components/Modal/FormModal";
import React, { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";

export default function RecordDashboard({
  id,
  name,
  accountType,
  getData = async (accountId) => [],
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
    id,
    useCallback(async () => {
      if (account && account.id) {
        return await getData(account.id);
      } else {
        return [];
      }
    }, [account, getData])
  );

  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent place-items-start">
        <div className={`hero-content block mx-auto my-20`}>
          {!isAccountLoading && !isDataLoading ? (
            <>
              <div className="card card-compact bg-base-100 shadow-xl mb-4">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="card-title">{name}</h2>
                    <div className="card-actions justify-end">
                      <FormModal
                        trigger={
                          <button className="btn btn-primary">
                            <Icon icon={<PlusIcon />} />
                            <div className="hidden md:block">
                              {newRecordButtonLabel} {name}
                            </div>
                            <div className="block md:hidden">New</div>
                          </button>
                        }
                        form={React.cloneElement(newRecordForm)}
                        onSuccess={(newData) => {
                          queryClient.setQueryData(id, [newData, ...data]);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {data.length > 0 ? (
                <>
                  <div className="hidden">
                    <div className="flex sm:flex lg:flex xl:flex"></div>
                    <div className="hidden sm:hidden lg:hidden xl:hidden"></div>
                  </div>
                  <Masonry>
                    {data.map((data, index) =>
                      React.cloneElement(dataComponent, {
                        key: index,
                        data: { ...data, index: index + 1 },
                        onDelete: () => {
                          queryClient.setQueryData(
                            id,
                            data.filter((p) => p.id !== data.id)
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
                    <div className="mx-auto">{noRecordLabel}</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className="radial-progress animate-spin"
              style={{
                "--value": 20,
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
