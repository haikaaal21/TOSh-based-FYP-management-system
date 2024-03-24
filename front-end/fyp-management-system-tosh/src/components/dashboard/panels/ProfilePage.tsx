import { Card, CardActionArea, CardMedia, Divider, Grid } from '@mui/material'

const ProfilePage = () => {
    return (
        <div>
            <h1>Profile</h1>

            {/*? Profile Card */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ padding: '10px 35px', borderRadius: '20px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '50px',
                            }}
                        >
                            <CardMedia
                                sx={{
                                    borderRadius: '100%',
                                    maxHeight: '300px',
                                    maxWidth: '300px',
                                }}
                                component="img"
                                image="https://via.placeholder.com/150"
                            />
                        </div>
                        <Grid
                            sx={{
                                padding: '10px 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            container
                            spacing={0}
                        >
                            <Grid item xs={6}>
                                <h2>Name</h2>
                            </Grid>
                            <Grid item xs={6}>
                                <p>Course</p>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid
                            sx={{
                                padding: '10px 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            container
                            spacing={0}
                        >
                            <Grid item xs={6}>
                                <p>Occupation</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>Faculty</p>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid
                            sx={{
                                padding: '10px 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            container
                            spacing={0}
                        >
                            <Grid item xs={6}>
                                <p>Full name</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>
                                    City, <b>Country</b>
                                </p>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid
                            sx={{
                                padding: '10px 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            container
                            spacing={0}
                        >
                            <Grid item xs={6}>
                                <p>Phone number</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>Email</p>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid
                            sx={{
                                padding: '10px 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            container
                            spacing={0}
                        >
                            <Grid item xs={6}>
                                <p>Current Address</p>
                            </Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                        <Divider />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <button
                                style={{
                                    borderRadius: '8px',
                                    margin: '25px 0',
                                    maxWidth: '35%',
                                    backgroundColor: 'var(--IndicatorBlue',
                                }}
                            >
                                <span>Icon&nbsp;</span>
                                Edit profile
                            </button>
                        </div>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/*? Current Project Card */}
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Card sx={{ borderRadius: '20px' }}>
                                <CardActionArea sx={{ padding: '10px 15px' }}>
                                    <p>Current Project</p>
                                    <h2>IoT Smart-Home Security</h2>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <CardMedia
                                                sx={{
                                                    borderRadius: '20px',
                                                    height: '12rem',
                                                    objectFit: 'cover',
                                                }}
                                                component="img"
                                                image="https://via.placeholder.com/150"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <p
                                                style={{
                                                    fontSize: '12pt',
                                                    height: '12rem',
                                                    overflow: 'clip',
                                                }}
                                            >
                                                Lorem ipsum dolor, sit amet
                                                consectetur adipisicing elit.
                                                Fugiat mollitia sed laborum,
                                                ratione eligendi totam!
                                                Voluptatibus, quia quisquam
                                                porro exercitationem vero
                                                necessitatibus aliquam esse
                                                veritatis et temporibus
                                                repellendus? Nulla, minus?
                                                Delectus inventore, recusandae
                                                assumenda reprehenderit quo
                                                quidem explicabo, dolores vero
                                                harum suscipit ratione similique
                                                id velit maxime quod aperiam
                                                eius deleniti corrupti
                                                blanditiis quos, totam officiis
                                                magni. Amet, voluptatum
                                                deserunt! Incidunt recusandae
                                                impedit dolore quos inventore!
                                                Dolorem ducimus, consectetur
                                                quos est, labore incidunt
                                                voluptatum nihil consequatur rem
                                                possimus, voluptatibus veritatis
                                                quae dolor? Quaerat magni
                                                exercitationem accusantium
                                                suscipit temporibus, sint dicta.
                                                Odit minus quas amet eligendi
                                                earum ratione ipsa molestias
                                                exercitationem. Veritatis, ad?
                                                Soluta aliquid explicabo
                                                cupiditate, assumenda officia
                                                ipsam repellendus! Eveniet autem
                                                inventore sapiente ducimus enim,
                                                dolores quaerat vel neque.
                                            </p>
                                        </Grid>
                                    </Grid>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        {/*? Lead thingy Card */}
                        <Grid item xs={12}>
                            <Card sx={{ borderRadius: '20px' }}>
                                <CardActionArea sx={{ padding: '10px 15px' }}>
                                    <div
                                        style={{
                                            padding: '15px 0',
                                            height: '200px',
                                        }}
                                    >
                                        <img
                                            src="https://via.placeholder.com/150"
                                            style={{
                                                position: 'absolute',
                                                zIndex: '5',
                                                borderRadius: '100%',
                                                height: '200px',
                                                width: '200px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 50,
                                                right: '0',
                                                zIndex: '0',
                                                backgroundColor:
                                                    'var(--SparesIndigo)',
                                                width: '80%',
                                                height: '150px',
                                            }}
                                        />
                                    </div>
                                    <h2>Cool Supervisor</h2>
                                    <p>Position</p>
                                    <p
                                        style={{
                                            fontSize: '12pt',
                                            height: '8rem',
                                            overflow: 'clip',
                                        }}
                                    >
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Expedita optio saepe
                                        adipisci aliquam ullam sint enim error
                                        dolore, praesentium quidem. Corrupti,
                                        qui iste quisquam repellat officia et
                                        facere? Totam, impedit. Ipsum vel minus,
                                        possimus voluptates numquam dolor
                                        voluptas dolorum omnis blanditiis
                                        tempora natus officia! Itaque in quidem
                                        voluptas consequatur cumque amet
                                        quibusdam, perferendis odio dignissimos
                                        iste aspernatur culpa reprehenderit
                                        eaque? Ut, harum? At, rerum numquam,
                                        odio recusandae, ut illo esse a enim
                                        consequatur corrupti exercitationem vel.
                                        Ipsum, excepturi omnis, repudiandae,
                                        minima cupiditate distinctio sed quam
                                        doloribus iste nulla enim magnam.
                                    </p>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default ProfilePage
