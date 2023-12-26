import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FrameLayout from "../frameLayout";
import dayjs from "dayjs";
import ActivityFormDialog from "./ActivityFormDialog";
import activityApi from "../../../../../../api/activity";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [actType, setActType] = useState("VIEW");
  const [current, setCurrent] = useState({});

  const isAuth = useSelector((state) => state.candAuth.isAuth);
  const getAll = async () => {
    const res = await activityApi.getByCurrentCandidate();
    setActivities(res);
  };
  const handleDelete = async (id) => {
    let choice = window.confirm("Bạn có chắc muốn xóa Hoạt động này?");
    if (choice) {
      await activityApi.destroy(id);
      let temp = activities.filter((item) => {
        return item.id !== id;
      });
      setActivities(temp);
    }
  };
  const handleEdit = (item) => {
    setActType("EDIT");
    setCurrent(item);
  };

  useEffect(() => {
    if (isAuth) {
      getAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <FrameLayout
      title="Hoạt động khác"
      hasaddbtn={true}
      className="mt-4"
      setActType={setActType}
    >
      {activities?.map((item, index) => (
        <div key={index}>
          <hr />
          <div className="border-0 border-success border-start ps-3 d-inline-block">
            <div className="fw-bold">{item.organization}</div>
            <div className="ts-ssm text-secondary">{item.role}</div>
            {item.start_date || item.start_date ? (
              <div>
                <span className="text-secondary ts-xs">
                  {dayjs(item.start_date).format("DD/MM/YYYY")} -{" "}
                  {!item.is_present
                    ? dayjs(item.end_date).format("DD/MM/YYYY")
                    : "hiện tại"}
                </span>
              </div>
            ) : null}
            <div className="ts-ssm">
              {item.link && (
                <div>
                  Link: <a href={item.link}>{item.link}</a>
                </div>
              )}
              <div>
                Mô tả:
                <span className="text-secondary"> {item.description}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 float-lg-end">
            <Stack direction="horizontal" gap={2}>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleEdit(item)}
              >
                Sửa
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleDelete(item.id)}
              >
                Xóa
              </Button>
            </Stack>
          </div>
        </div>
      ))}
      {actType !== "VIEW" && (
        <ActivityFormDialog
          actType={actType}
          setActType={setActType}
          current={current}
          getAll={getAll}
        />
      )}
    </FrameLayout>
  );
}
