import { useState, Fragment } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Grid, Box, Button, TextField, InputLabel, Select, FormControl, MenuItem, Typography } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Card, CardContent, CardActions } from "@mui/material";
import { GET_BUGS } from "../GraphQL/Queries";
import { ADD_BUG, UPDATE_BUG_STATUS, DELETE_BUG } from "../GraphQL/Mutations";

export default function TransitionsPopper(props) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const { loading, error, data } = useQuery(GET_BUGS);

  const [addBug] = useMutation(ADD_BUG, {
    update(cache, { data: { addBug } }) {
      cache.modify({
        fields: {
          bugs(existingBugs = []) {
            const newBugRef = cache.writeFragment({
              data: addBug,
              fragment: gql`
                fragment NewBug on Bug {
                  id
                  name
                  status
                }
              `,
            });
            return [...existingBugs, newBugRef];
          },
        },
      });
    },
  });

  const [updateBugStatus] = useMutation(UPDATE_BUG_STATUS);

  const [deleteBug] = useMutation(DELETE_BUG, {
    update(cache, { data: { deleteBug } }) {
      cache.modify({
        fields: {
          bugs(existingBugs = []) {
            return existingBugs.filter(
              (bugRef) => bugRef.__ref !== `Bug:${deleteBug}`
            );
          },
        },
      });
    },
  });

  const handleAddBug = async () => {
    setOpen(false);
    if (name && status) {
      await addBug({ variables: { name, status } });
      setName("");
      setStatus("");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateBugStatus({ variables: { id, status: newStatus } });
  };

  const handleDeleteBug = async (id) => {
    await deleteBug({ variables: { id } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Box mt={1} mb={1}>
        <Button type="button" onClick={()=> setOpen(true)} variant="contained">
          Add New Bug
        </Button>
        <Dialog open={open} onClose={()=> setOpen(false)}>
          <DialogTitle>New Bug</DialogTitle>
          <DialogContent>
            <Box sx={{ width: 300 }} mt={2}>
              <TextField
                id="outlined-basic"
                label="BugName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </Box>
            <Box sx={{ width: 300 }} mt={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={"New"}>New</MenuItem>
                  <MenuItem value={"Progress"}>Progress</MenuItem>
                  <MenuItem value={"Done"}>Done</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBug}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box sx={{ width: 1200 }}>
        <Grid container spacing={4} ml={2} mr={2}>
          {data.bugs.map((bug) => (
            <Grid item xs={2} key={bug.id}>
              <Box sx={{ minWidth: 100 }}>
                <Card variant="outlined">
                  <Fragment>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 18 }}
                        color="text.primary"
                        gutterBottom
                      >
                        {bug.name}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.primary">
                        {bug.status}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Edit
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={bug.status}
                          label="Status"
                        >
                          <MenuItem
                            onClick={() => handleStatusChange(bug.id, "New")}
                            value={"New"}
                          >
                            New
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(bug.id, "Progress")
                            }
                            value={"Progress"}
                          >
                            Progress
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleStatusChange(bug.id, "Done")}
                            value={"Done"}
                          >
                            Done
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        size="small"
                        style={{ marginLeft: "5px" }}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleDeleteBug(bug.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Fragment>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
